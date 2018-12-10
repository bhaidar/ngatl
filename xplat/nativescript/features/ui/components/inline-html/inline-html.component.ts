import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
// nativescript
// libs
import {
  LogService,
  environment
} from '@ngatl/core';
import {
  safeSplit,
} from '@ngatl/utils';

export interface ISpan {
  text: string;
  link?: string;
  color?: string;
  weight?: string;
  icon?: string;
  small?: string;
}

export interface IBlock {
  spans: Array<ISpan>;
}

// for swapping of links for beta and rc builds
const domain = 'ng-atl.com';
const protocolSuffix = '://';
const protocolWwwSuffix = `${protocolSuffix}www.`;

export abstract class InlineHtmlBaseComponent implements OnInit {
  @Input() containerClass: string;
  @Input() text: string;
  @Input() linkable: boolean = true; // disable links if needed
  @Input() autoUpdate: boolean = false;
  @Output() openWebView: EventEmitter<any> = new EventEmitter();

  public blocks: Array<IBlock> = [];
  public spans: Array<ISpan>;
  public bullets: Array<ISpan> = [];

  constructor(public log: LogService) { }

  ngOnInit(): void {
    // console.log('parsing text:', this.text);
    this._parse(this.text);
  }

  ngOnChanges(changes) {
    if ( this.autoUpdate && changes && changes.text ) {
      this.bullets = [];
      this.blocks = [];
      // reparse
      this._parse(this.text);
    }
  }

  public openLink(span: ISpan) {
    const apiUrl = environment.API_URL;
    if ( span && span.link ) {
      let url = span.link;
      // this.log.debug('processing raw link:', url);
      // wish we didn't have to do this but Content has errors all over the place with their links
      // just get super resilient to errors that Content team has made
      if ( url.indexOf('https://https://') > -1 ) {
        // yes, Content team has links like this
        // we have mentioned it several times but we just cannot keep going back/forth, just correct their errors
        // https://ugroupmedia.atlassian.net/browse/PNP-14440
        url = url.substring(8, url.length);
      }
      if ( url.indexOf(domain) > -1 ) {
        // portablenorthpole domain link
        // compare to use against same api target in use
        let urlParts = safeSplit(url, protocolWwwSuffix);
        if ( urlParts.length === 1 ) {
          // apex domain
          urlParts = safeSplit(url, protocolSuffix);
        }
        if ( urlParts.length > 1 ) {
          let subdomain = 'beta.'; // default
          // replace with rc or beta
          if ( url.indexOf('rc.') > -1 || url.indexOf('beta.') > -1 ) {
            // already a staging url
            subdomain = '';
          }
          url = `${urlParts[0]}${protocolSuffix}${subdomain}${urlParts[1]}`;
        }
      }
      // all links should have `internal=true`
      // generally if opening production portablenorthpole.com domain
      // that will flag the site to hide features
      // as to not expose when viewing within an embedded webview
      const internalParam = 'internal=true';
      let separator = '?';
      if ( url.indexOf(separator) > -1 ) {
        // adding additional param
        separator = '&';
      }
      url = `${url}${separator}${internalParam}`;
      if ( url.indexOf('http') === -1 ) {
        // add domain to the url
        let subdomain = 'www.';
        url = `https${protocolSuffix}${subdomain}${domain}${url}`;
      }

      // improve resiliency to mishaps from Content team
      // https://ugroupmedia.atlassian.net/browse/PNP-14440
      url = url.replace(/https\/\//, '');

      const context = {
        url,
        title : span.text,
      };
      this.log.debug('InlineHtml openWebView link:', context.url);
      this.openWebView.next(context);
    }
  }

  private _parse(text) {

    let parts = safeSplit(text, /<p>|<\/p>|<br>|<br\/>|<ul>|<\/ul>/);
    let bulleted;
    for ( let part of parts ) {
      if ( part ) {

        part = this._flattenAndTrim(part);
        part = this._parseFrenchCharacters(part);

        if ( part.indexOf('<i') > -1 ) {
          bulleted = parts;
          break;
        } else {
          if ( part.indexOf('<li') > -1 ) {
            this.blocks.push({
              spans : this._parseLi(part),
            });
          } else {
            this.blocks.push({
              spans : this._parseFormatting(part),
            });
          }

        }
      }
    }
    if ( bulleted ) {
      // parse bullet list
      this.bullets.push(this._parseBullets(parts));
    }

    // ensure front of first block text does not contain erroneous space
    if ( this.blocks && this.blocks.length && this.blocks[0].spans && this.blocks[0].spans.length ) {
      const spanText = this.blocks[0].spans[0].text;
      if ( spanText && spanText.indexOf(' ') === 0 ) {
        this.blocks[0].spans[0].text = spanText.substring(1);
      }
    }
  }

  private _parseLi(text) {
    const formatted = [];

    // li text
    const liParts = safeSplit(text, /<li>|<\/li>/);
    if ( liParts ) {
      for ( const li of liParts ) {
        if ( li && li.length > 1 ) {
          const text = '-' + this._flattenAndTrim(li);
          formatted.push({ text });
        }
      }
    }
    return formatted;
  }


  private _parseBullets(parts) {
    const span: ISpan = {
      text : '',
    };

    const parseSmall = (text) => {
      // sub/small text
      const smallParts = safeSplit(text, /<small>|<\/small>/);
      if (smallParts) {
        // console.log('parseSmall:', smallParts.length);
        for (const sm of smallParts) {
          // console.log('sm:', sm);
          if (sm) {
            const text = this._flattenAndTrim(sm);
            if (span.small) {
              // adding more small text
              span.small += ` ${text}`;
            } else {
              span.small = text;
            }
          }
        }
      }
    };

    for ( let part of parts ) {
      if ( part ) {
        part = this._flattenAndTrim(part);
        part = safeSplit(part, /<i>|<\/i>/);

        if ( part ) {
          // console.log('split on <i...', part.length);
          // for (let p of part) {
          //     console.log(p);
          // }
          if ( part.length > 1 ) {
            // get the font class
            const fontClassParts = part[0].match(/class=(["'])(.*?)\1/);
            let fontClass: any = safeSplit(fontClassParts[2], ' ');
            if ( fontClass && fontClass.length ) {
              fontClass = fontClass[1];
              span.icon = fontClass;
            }
            const text = this._flattenAndTrim(part[1]);
            if ( text.indexOf('<small') > -1 ) {
              const textParts = safeSplit(text, '<small>');
              span.text = this._flattenAndTrim(textParts[0]);
              parseSmall(textParts[1]);
            } else {
              span.text = text;
            }
            // console.log('span.text:', span.text);
          } else {
            parseSmall(part[0]);
          }
        }
      }
    }

    return span;
  }

  private _parseFormatting(text) {
    // parse links and colors
    const formatted = [];
    const parts = safeSplit(text, /<a |<\/a>/);
    for ( const part of parts ) {
      let link;
      if ( part ) {
        if ( part.indexOf('href') > -1 ) {
          // let linkParts = part.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
          const linkParts = part.match(/href=(["'])(.*?)\1/);
          // console.log('linkParts:', linkParts);
          if ( linkParts ) {
            link = linkParts[linkParts.length - 1];
            const textParts = safeSplit(part, '>');
            const text = textParts[textParts.length - 1];
            // console.log('link:', link);
            if ( this.linkable ) {
              formatted.push({
                text,
                link,
              });
            } else {
              formatted.push({ text });
            }
          }
        } else {
          const otherParts = safeSplit(part, /<font|<\/font>/);
          let color;
          for ( const p of otherParts ) {
            if ( p ) {
              let trimmed = p.trim();
              if ( trimmed ) {
                const colorParts = trimmed.match(/color=(["'])(.*?)\1/);
                if ( colorParts ) {
                  color = colorParts[colorParts.length - 1];
                  trimmed = trimmed.replace(`color="${color}">`, '');
                }
                const boldParts = safeSplit(trimmed, /<\/b>|<\/strong>/);
                // console.log('boldParts:', boldParts);
                if ( boldParts.length > 1 ) {
                  for ( const boldPart of boldParts ) {
                    if ( boldPart ) {
                      const extracted = safeSplit(boldPart.trim(), /<b>|<strong>/);
                      if ( extracted.length > 1 ) {
                        let one = extracted[0].trim();
                        if ( one ) {
                          one = this._handleEndings(one);
                          formatted.push({
                            text : one,
                            color : color || null,
                            weight : 'normal',
                          });
                        }
                        let two = extracted[1].trim();
                        if ( two ) {
                          two = this._handleEndings(two);
                          formatted.push({
                            text : two,
                            color : color || null,
                            weight : 'bold',
                          });
                        }
                        if ( extracted.length > 2 ) {
                          // the rest
                          for ( let t = 2; t < extracted.length; t++ ) {
                            let eText = extracted[t].trim();
                            if ( eText ) {
                              eText = this._handleEndings(eText);
                              formatted.push({
                                text : eText,
                                color : color || null,
                                weight : 'normal',
                              });

                            }
                          }
                        }

                      }
                    }
                  }
                } else {
                  trimmed = this._handleEndings(trimmed);
                  formatted.push({
                    text : trimmed,
                    color : color || null,
                    weight : 'normal',
                  });
                }

              }
            }
          }
        }
      }
    }
    return formatted;
  }

  private _handleEndings(text) {
    if ( text !== '.' ) {
      text = `${text === ',' ? '' : ' '}${text} `;
    }
    return text;
  }

  private _flattenAndTrim(text) {
    return text.replace(/&nbsp;/ig, ' ').trim();
  }

  private _parseFrenchCharacters(text) {
    return text ? text.replace(/&eacute;/ig, 'é') : text;
  }
}

@Component({
  moduleId : module.id,
  selector : 'inline-html-label',
  template : `
    <WrapLayout [ngClass]="containerClass" *ngFor="let block of blocks" (tap)="tapContainer.emit(true)">
        <inline-html-linkable-label *ngFor="let span of block.spans" [span]="span" (tapLink)="openLink($event)"></inline-html-linkable-label>
    </WrapLayout>
    `,
})
export class InlineHtmlLabelComponent extends InlineHtmlBaseComponent {
  @Output() tapContainer: EventEmitter<any> = new EventEmitter();

  constructor(public log: LogService) {
    super(log);
  }
}

@Component({
  moduleId : module.id,
  selector : 'inline-html-linkable-label',
  template : `<Label #label [text]="span.text" textWrap="true" [class.link-bold]="span.weight === 'bold'" [class.text-primary]="span.link" [attr.color]="span.color" [attr.fontWeight]="span.weight">
      </Label>`,
})
export class InlineHtmlLinkableLabelComponent implements OnInit {
  @ViewChild('label') private _el: ElementRef;
  @Input() span: ISpan;
  @Output() tapLink: EventEmitter<ISpan> = new EventEmitter();

  ngOnInit() {
    if ( this.span && this.span.link ) {
      // allow tap
      this._el.nativeElement.on('tap', () => {
        this.tapLink.next(this.span);
      });
    }
  }
}

@Component({
  moduleId : module.id,
  selector : 'inline-html',
  template : `
    <WrapLayout [ngClass]="containerClass" *ngFor="let block of blocks">
        <inline-html-linkable-label *ngFor="let span of block.spans" [span]="span" (tapLink)="openLink($event)"></inline-html-linkable-label>
    </WrapLayout>
    <GridLayout [ngClass]="containerClass" *ngFor="let bullet of bullets" rows="auto,auto" columns="auto,*">
      <Label class="fa bullet-icon" [text]="bullet.icon | fonticon" row="0" col="0"></Label>
      <Label [text]="bullet.text" row="0" col="1" textWrap="true" class="bullet-text"></Label>
      <Label [text]="bullet.small" class="small" row="1" col="1" textWrap="true"></Label>
    </GridLayout>
    `,
})
export class InlineHtmlComponent extends InlineHtmlBaseComponent {
  constructor(public log: LogService) {
    super(log);
  }
}

