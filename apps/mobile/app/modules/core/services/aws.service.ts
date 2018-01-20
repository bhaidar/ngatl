import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

// libs
const CryptoJS = require( 'crypto-js' );
import {
  format
} from 'date-fns';
import { session as httpSession } from 'nativescript-background-http';
import { File, path } from 'tns-core-modules/file-system';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { LogService, WindowService, isObject, UserService, ProgressService } from '@ngatl/core';

export interface IAWSCred {
  id: string;
  password: string;
  access_key: string;
  secret: string;
  region: string;
  bucket: string;
}

@Injectable()
export class AWSService {

  private _credentials: IAWSCred;

  constructor(
    private _log: LogService,
    private _http: HttpClient,
    private _translate: TranslateService,
    private _win: WindowService,
    private _userService: UserService,
    private _progressService: ProgressService,
    private _ngZone: NgZone,
  ) {

  }

  public upload( file: File ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      this._getCredentials().then( ( cred: IAWSCred ) => {
        // const file = File.fromPath( filePath );
        this._log.debug('file path:', file.path);
        const ext = file.extension.slice(1);
        this._log.debug( 'file ext:', ext );
        // const data = file.readSync();
        // this._log.debug( 'typeof data:', typeof data );
        const keyPath = file.name;
        this._log.debug( 'keyPath:', keyPath );
        const params: any = {
          Bucket: 'ng-atl',
          Key: keyPath,
          // Body: new Buffer( data ),
          ACL: 'public-read',
          CacheControl: 'max-age=2628000'
        };

        switch ( ext ) {
          case 'caf':
            params.ContentType = 'audio/x-caf';
            break;
          case 'mp3':
            params.ContentType = 'audio/mp3';
            break;
          case 'png':
            params.ContentType = 'image/png';
            break;
          case 'jpg':
          case 'jpeg':
            params.ContentType = 'image/jpeg';
            break;
        }

        const url = "http://s3.amazonaws.com/" + params.Bucket + "/" + keyPath;

        // let payloadHash = this.getPayloadHash(payload);
        let payloadHash = "UNSIGNED-PAYLOAD";
        const amzDate = this._getAmzDate(new Date().toISOString());

        this._log.debug( 'amzDate:', amzDate );
        let options: any = {
          method: "PUT",
          headers: new HttpHeaders( {
            "Host": "s3.amazonaws.com",                 // Mandatory
            "Content-Type": params.ContentType,                   // Mandatory
            //"Content-Length": "10000",                // Mandatory: This header is required for PUTs
            // When you specify the Authorization header, you must specify either the x-amz-date or the Date header
            "x-amz-date": amzDate,
            "x-amz-content-sha256": payloadHash,        // Mandatory: It provides a hash of the request payload.
            "x-amz-acl": "public-read"                // Optional: By default, all objects are private: only the owner has full control.
            //"Authorization"   // Will be added by addAuthorizationHeader
            //"Content-MD5"     // Recommended: The base64 encoded 128-bit MD5 digest of the message
          } )
        };
        // Adding the authorization header
        let authorization = this.getAuthorizationHeader( options,
          cred.access_key, cred.secret,
          cred.region, cred.bucket, keyPath, amzDate, payloadHash );
        options.headers.append( "Authorization", authorization );
        this._log.debug('authorization:', authorization);

        let session = httpSession( "aws-uploader" );
        let request = {
          url: url,
          method: "PUT",
          headers: {
            "Host": "s3.amazonaws.com",                 // Mandatory
            "Content-Type": params.ContentType,                   // Mandatory
            //"Content-Length": "10000",                // Mandatory: This header is required for PUTs
            // When you specify the Authorization header, you must specify either the x-amz-date or the Date header
            "x-amz-date": amzDate,
            "x-amz-content-sha256": payloadHash,        // Mandatory: It provides a hash of the request payload.
            "x-amz-acl": "public-read",              // Optional: By default, all objects are private: only the owner has full control.
            //"Authorization"   // Will be added by addAuthorizationHeader
            //"Content-MD5"     // Recommended: The base64 encoded 128-bit MD5 digest of the message
            "Authorization": authorization
          },
          description: "{ 'Uploading': '" + file.name + "' }"
        };

        const task = session.uploadFile( file.path, request );
        task.on( "progress", ( e ) => {
          // console.log( 'progress:', e );
          // if (isObject(e)) {
          //   for (const key in e) {
          //     this._log.debug(key, e[key]);
          //   }
          // }
        });
        task.on( "error", ( e ) => {
          console.log( 'error:', e );
          // if (isObject(e)) {
          //   for (const key in e) {
          //     this._log.debug(key, e[key]);
          //   }
          // }
          reject(e);
        });
        task.on( "complete", ( e ) => {
          // console.log( 'complete:', e );
          // if (isObject(e)) {
          //   for (const key in e) {
          //     this._log.debug(key, e[key]);
          //   }
          // }
          resolve(url);
        });

      }, ( err ) => {
        this._log.debug( 'could not upload to aws.' );
        this._win.setTimeout( _ => {
          this._win.alert( this._translate.instant( 'general.error' ) );
        }, 300 );
      } );

    } );
  }
 
  // this function converts the generic JS ISO8601 date format to the specific format the AWS API wants
  private _getAmzDate(dateStr): string {
    var chars = [":","-"];
    for (var i=0;i<chars.length;i++) {
      while (dateStr.indexOf(chars[i]) != -1) {
        dateStr = dateStr.replace(chars[i],"");
      }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    return dateStr;
  }

  protected getAuthorizationHeader( options: any, s3Key: string, s3Secret: string,
    s3Region: string, s3Bucket: string, s3Path: string, date, payloadHash: string ): string {
    // Credential=AKIAIOSFODNN7EXAMPLE/20130524/us-east-1/s3/aws4_request, 
    let credential = this.getCredential( s3Key, s3Region, date );

    // SignedHeaders=host;range;x-amz-date,
    // A semicolon-separated list of request headers that you used to compute Signature. 
    // The list includes header names only, and the header names must be in lowercase.
    let signedHeaders = (<HttpHeaders>options.headers).keys()
      .map( function ( hdr ) { return hdr.toLowerCase(); } )
      .join( ";" );
    this._log.debug('signedHeaders:', signedHeaders);

    // Signature=fe5f80f77d5fa3beca038a248ff027d0445342fe2855ddc963176630326f1024
    // The 256-bit signature expressed as 64 lowercase hexadecimal characters.
    let strToSign = this.getStrToSign( options, date, s3Region, s3Bucket, s3Path, payloadHash );
    let signature = this.getSignature( strToSign, date, s3Secret, s3Region ).toLowerCase();

    // Authorization: AWS4-HMAC-SHA256 Credential=...,SignedHeaders=...,Signature=...
    // There is space between the first two components, AWS4-HMAC-SHA256 and Credential
    // The subsequent components, Credential, SignedHeaders, and Signature are separated by a comma.
    let authorization = "AWS4-HMAC-SHA256 Credential=" + credential +
      ",SignedHeaders=" + signedHeaders + ",Signature=" + signature;

    return authorization;
  }

  protected getCredential( s3Key: string, s3Region: string, date ) {
    // Credential=AKIAIOSFODNN7EXAMPLE/20130524/us-east-1/s3/aws4_request, 
    // Your access key ID and the scope information, which includes the date, region, and service that were used to calculate the signature.
    return s3Key + "/" + date.split("T")[0] + "/" + s3Region + "/s3/aws4_request";
  }

  protected getStrToSign( options: any, date, s3Region: string, s3Bucket: string, s3Path: string, payloadHash: string ) {
    // "AWS4-HMAC-SHA256" + "\n" +
    // timeStampISO8601Format + "\n" +
    // <Scope> + "\n" +
    // Hex(SHA256Hash(<CanonicalRequest>))

    let cannonicalRequest = this.getCannonicalRequest( options, s3Bucket, s3Path, payloadHash );
    let strToSign = "AWS4-HMAC-SHA256\n";

    //timeStampISO8601Format
    strToSign += date + '\n'; //format( date, "YYYYMMDD[T]HHmmss[Z]" ) + "\n";

    // Scope binds the resulting signature to a specific date, an AWS region, and a service.
    // Thus, your resulting signature will work only in the specific region and for a specific service.
    // The signature is valid for seven days after the specified date.
    strToSign += date.split("T")[0] + "/" + s3Region + "/s3/aws4_request" + "\n";

    //Hex(SHA256Hash(cannonicalRequest))
    //SHA256Hash(): Secure Hash Algorithm (SHA) cryptographic hash function.
    strToSign += CryptoJS
      .SHA256( cannonicalRequest )
      .toString( CryptoJS.enc.Hex );
    this._log.debug('strToSign:', strToSign);

    //console.log("<StrToSign>" + strToSign + "<StrToSignEnds>");

    return strToSign;
  }

  protected getPayloadHash( payload ): string {
    return CryptoJS
      .SHA256( payload )
      .toString( CryptoJS.enc.Hex );    // Not really necessary
  }

  protected getCannonicalRequest( options: any, s3Bucket: string, s3Path: string, payloadHash: string ) {
    // <HTTPMethod>\n
    // <CanonicalURI>\n
    // <CanonicalQueryString>\n
    // <CanonicalHeaders>\n
    // <SignedHeaders>\n
    // <HashedPayload>
    let cannonicalRequest = "";

    // <HTTPMethod>\n
    cannonicalRequest += options.method + "\n";
    // <CanonicalURI>\n
    // CanonicalURI is the URI-encoded version of the absolute path component of the URI —
    // everything starting with the "/" that follows the domain name and up to the end of the string or
    // to the question mark character ('?') if you have query string parameters.
    if ( options.headers.get( "Host" ).lastIndexOf( s3Bucket ) != -1 ) {
      cannonicalRequest += "/" + encodeURI( s3Path ) + "\n";
    } else {
      cannonicalRequest += "/" + encodeURI( s3Bucket ) + "/" + encodeURI( s3Path ) + "\n";
    }
    // <CanonicalQueryString>\n
    cannonicalRequest += "\n";  // There is no query string

    // <CanonicalHeaders>\n
    // CanonicalHeaders is a list of request headers with their values.
    // Individual header name and value pairs are separated by the newline character ("\n").
    // Header names must be in lowercase. You must sort the header names alphabetically to construct the string
    // The CanonicalHeaders list must include the following:
    // - HTTP host header.
    // - If the Content-Type header is present in the request, you must add it to the CanonicalHeaders list.
    // - The x-amz-content-sha256 header is required for all AWS Signature Version 4 requests. It provides a hash of the request payload.
    let headers = options.headers.keys()
      .map( function ( v, k ) { return v.toLowerCase() + ":" + options.headers.get( v ).trim(); } )
      .sort( function ( v, k ) { 
        let a = v.split( ":" )[0];
        let b = k.split( ":" )[0];
        if (a < b) return -1; if (a > b) return 1; return 0;
      } )
      // .value()
      .join( "\n" );
    cannonicalRequest += headers + "\n";

    cannonicalRequest += "\n";  // ?

    // <SignedHeaders>\
    // SignedHeaders is an alphabetically sorted, semicolon-separated list of lowercase request header names.
    let signedHeaders = options.headers.keys()
      .map( function ( hdr ) { return hdr.toLowerCase(); } )
      .sort(function(a,b) { if (a < b) return -1; if (a > b) return 1; return 0; })
      .join( ";" );
    cannonicalRequest += signedHeaders + "\n";

    // <HashedPayload>
    cannonicalRequest += payloadHash;

    //console.log("<CannonicalRequest>" + cannonicalRequest + "<CannonicalRequestEnds>");

    return cannonicalRequest;
  }

  /**
   * From: http://docs.amazonwebservices.com/AmazonS3/latest/dev/RESTAuthentication.html
   * @return a signature for this request.
   */
  protected getSignature( strToSign: string, date, s3Secret, s3Region ) {
    // HMAC-SHA256(): Computes HMAC by using the SHA256 algorithm with the signing key provided. This is the final signature.
    // https://code.google.com/archive/p/crypto-js/
    // var hash = CryptoJS.HmacSHA256("Message", "Secret Passphrase");

    // WARNING: The way amazon presents the key/phrase is the oposite to the method signature
    // DateKey              = HMAC-SHA256("AWS4"+"<SecretAccessKey>", "<YYYYMMDD>")
    let dateKey = CryptoJS.HmacSHA256( date.split("T")[0], "AWS4" + s3Secret );
    // DateRegionKey        = HMAC-SHA256(<DateKey>, "<aws-region>")
    let dateRegionKey = CryptoJS.HmacSHA256( s3Region, dateKey );
    // DateRegionServiceKey = HMAC-SHA256(<DateRegionKey>, "<aws-service>")
    let dateRegionServiceKey = CryptoJS.HmacSHA256( "s3", dateRegionKey );
    // SigningKey           = HMAC-SHA256(<DateRegionServiceKey>, "aws4_request")
    let signKey = CryptoJS.HmacSHA256( "aws4_request", dateRegionServiceKey );

    // sign the request string
    let signature = CryptoJS
      .HmacSHA256( strToSign, signKey )
      .toString( CryptoJS.enc.Hex );
    this._log.debug('signature:', signature);

    //console.log("Signature :", signature);

    return signature;
  }

  private _getCredentials() {
    return new Promise( ( resolve, reject ) => {
      if ( !this._credentials ) {
        this._http.get( '/assets/aws.json' )
          .catch( ( err ) => {
            reject( err );
            return Observable.of( err );
          } )
          .subscribe( ( result ) => {
            this._credentials = result;
            this._log.debug( 'aws cred:', JSON.stringify( result ) );
            resolve( this._credentials );
          } );
      } else {
        resolve( this._credentials );
      }
    } );
  }
}