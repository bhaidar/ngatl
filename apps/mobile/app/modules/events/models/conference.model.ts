import * as observable from "tns-core-modules/data/observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EventState } from '../states';
function formatTime(time: Date) {
    var hour: number = time.getHours();
    var min: string = time.getMinutes() + "";
    return (hour <= 12 ? hour : hour - 12) + ":" + (min.length === 1 ? '0' + min : min) + (hour < 12 ? " AM" : " PM")
}

export class Session extends observable.Observable implements EventState.IEvent {
    public id:string;
    public name:string;
    public created:string;
    public modified:string;
    public duration:string;
    public startTime:string;
    public startDate: Date;
    public endTime:string;
    public endDate: Date;
    public type:string;
    public room:string;
    public speaker:string;
    public isFavorite: boolean;
    public cssClass: string;

    constructor(model?: any) {
        super();
        if (model) {
            for (const key in model) {
                this[key] = key === 'room' && model[key] ? `Room ${model[key]}` : model[key];
            }
        }
        this.cssClass = "session-favorite";
    }

    public toggleFavorite() {
        let favorite = this.get("isFavorite");
        this.set("isFavorite", !favorite);
        this.set("cssClass", !favorite ? "session-favorite-selected" : "session-favorite-unselected");
        setTimeout(() => { this.set("cssClass", "session-favorite"); }, 600);
    }
}

// Schedule
// var allSessions: Array<Session> = [
//     // Day 1
//     new Session("NativeScript Deep Dive 1",
//         new Date(2018, 0, 30, 9, 30), new Date(2018, 0, 30, 12, 30), "room 1", true),
//     new Session("Smart Design for Smartphones",
//         new Date(2018, 0, 30, 9, 30), new Date(2018, 0, 30, 12, 30), "room 2", false),
//     new Session("Build, Deploy, and Scale your Mobile Backend with Node.js and Modulus",
//         new Date(2018, 0, 30, 9, 30), new Date(2018, 0, 30, 12, 30), "room 3", false),
//     new Session("NativeScript Deep Dive 2",
//         new Date(2018, 0, 30, 13, 30), new Date(2018, 0, 30, 16, 30), "room 1", true),
//     new Session("Smart Design for Smartphones",
//         new Date(2018, 0, 30, 13, 30), new Date(2018, 0, 30, 16, 30), "room 2", false),
//     new Session("Responsive Apps with Telerik DevCraft",
//         new Date(2018, 0, 30, 13, 30), new Date(2018, 0, 30, 16, 30), "room 3", false),

//     // Day 2
//     new Session("Telerik Keynote - Mobilizing and Modernizing",
//         new Date(2018, 0, 31, 9, 30), new Date(2018, 0, 31, 12, 30), "room 1", true),

//     new Session("A Lap Around NativeScript",
//         new Date(2018, 0, 31, 10, 45), new Date(2018, 0, 31, 11, 30), "room 1", true),
//     new Session("Kendo UI Building Blocks",
//         new Date(2018, 0, 31, 10, 45), new Date(2018, 0, 31, 11, 30), "room 2", false),

//     new Session("AngularJS 2.0",
//         new Date(2018, 0, 31, 11, 45), new Date(2018, 0, 31, 12, 30), "room 1", true),
//     new Session("Getting Started with ScreenBuilder",
//         new Date(2018, 0, 31, 11, 45), new Date(2018, 0, 31, 12, 30), "room 2", false),

//     new Session("NativeScript Extensibility",
//         new Date(2018, 0, 31, 13, 30), new Date(2018, 0, 31, 14, 15), "room 1", true),
//     new Session("AngularJS and Kendo UI ",
//         new Date(2018, 0, 31, 13, 30), new Date(2018, 0, 31, 14, 15), "room 2", false),

//     new Session("Building a CRM Portal in 45 Minutes",
//         new Date(2018, 0, 31, 14, 30), new Date(2018, 0, 31, 15, 15), "room 1", false),
//     new Session("JavaScript Beyond the Basics",
//         new Date(2018, 0, 31, 14, 30), new Date(2018, 0, 31, 15, 15), "room 2", true),
        
//     // Day 3
//     new Session("Sitefinity Keynote",
//         new Date(2018, 1, 1, 9, 30), new Date(2018, 1, 1, 12, 30), "room 1", true),

//     new Session("Introduction to Mobile Testing & Device Cloud",
//         new Date(2018, 1, 1, 10, 45), new Date(2018, 1, 1, 11, 30), "room 1", true),
//     new Session("Using Kendo UI in SharePoint/Office 365",
//         new Date(2018, 1, 1, 10, 45), new Date(2018, 1, 1, 11, 30), "room 2", false),

//     new Session("Improving Applications with Telerik Analytics",
//         new Date(2018, 1, 1, 11, 45), new Date(2018, 1, 1, 12, 30), "room 1", true),
//     new Session("Building Offline Ready Mobile Apps",
//         new Date(2018, 1, 1, 11, 45), new Date(2018, 1, 1, 12, 30), "room 2", false),

//     new Session("Debugging with Fiddler",
//         new Date(2018, 1, 1, 13, 30), new Date(2018, 1, 1, 14, 15), "room 1", true),
//     new Session("Performance Tuning Your Mobile Web Apps",
//         new Date(2018, 1, 1, 13, 30), new Date(2018, 1, 1, 14, 15), "room 2", false),

//     new Session("Cross platform Telerik Native Mobile UI",
//         new Date(2018, 1, 1, 14, 30), new Date(2018, 1, 1, 15, 15), "room 1", false),
//     new Session("Advanced Kendo UI",
//         new Date(2018, 1, 1, 14, 30), new Date(2018, 1, 1, 15, 15), "room 2", true),

//     // Day 4
//     new Session("Building Offline Ready Mobile Apps",
//         new Date(2018, 1, 2, 9, 30), new Date(2018, 1, 2, 12, 30), "room 1", true),

//     new Session("Introduction to Mobile Testing & Device Cloud",
//         new Date(2018, 1, 2, 10, 45), new Date(2018, 1, 2, 11, 30), "room 1", true),
//     new Session("Cross platform Telerik Native Mobile UI",
//         new Date(2018, 1, 2, 10, 45), new Date(2018, 1, 2, 11, 30), "room 2", false),

//     new Session("Using Kendo UI in SharePoint/Office 365",
//         new Date(2018, 1, 2, 11, 45), new Date(2018, 1, 2, 12, 30), "room 1", true),
//     new Session("Advanced Kendo UI",
//         new Date(2018, 1, 2, 11, 45), new Date(2018, 1, 2, 12, 30), "room 2", false),

//     new Session("Debugging with Fiddler",
//         new Date(2018, 1, 2, 13, 30), new Date(2018, 1, 2, 14, 15), "room 1", true),
//     new Session("Performance Tuning Your Mobile Web Apps",
//         new Date(2018, 1, 2, 13, 30), new Date(2018, 1, 2, 14, 15), "room 2", false),

//     new Session("Cross platform Telerik Native Mobile UI",
//         new Date(2018, 1, 2, 14, 30), new Date(2018, 1, 2, 15, 15), "room 1", false),
//     new Session("Sitefinity Keynote",
//         new Date(2018, 1, 2, 14, 30), new Date(2018, 1, 2, 15, 15), "room 2", true),
// ];

export class ConferenceViewModel extends observable.Observable {
    public schedule$: BehaviorSubject<Array<EventState.IEvent>> = new BehaviorSubject([]);
    private _fullSchedule: Array<EventState.IEvent> = [];

    public set fullSchedule(value: Array<EventState.IEvent>) {
        this._fullSchedule = value;
        this.filter();
    }

    public get fullSchedule() {
        return this._fullSchedule;
    }
    
    private _selectedDay: number;
    public get selectedDay(): number {
        return this._selectedDay;
    }
    public set selectedDay(value: number) {
        if (this._selectedDay !== value) {
            this._selectedDay = value;
            this.filter();
        }
    }

    private _search: string;
    public get search(): string {
        return this._search;
    }
    public set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.filter();
        }
    }

    private _favoritesOnly = false;
    public get favoritesOnly() {
        return this._favoritesOnly;
    }
    public set favoritesOnly(value: boolean) {
        this._favoritesOnly = value;
        this.filter();
    }

    private filter() {
        let day = this.selectedDay;
        let textFilter = this.search ? this.search.toLocaleLowerCase() : this.search;

        if (this._fullSchedule) {
            let filteredSessions = this._fullSchedule.filter((session) => {
              const isDay = session.startDate.getDate() === day;
              const isMatch = !textFilter || session.name.toLocaleLowerCase().indexOf(textFilter) >= 0;
                let include = false;
                if (this._favoritesOnly) {
                  include = isDay && session.isFavorite && isMatch;
                } else {
                  include = isDay && isMatch;
                }
                if (include) {
                    session.cssClass = "session-favorite";
                }
                return include;
            });
    
            this.schedule$.next(filteredSessions);
        }
    }

    constructor() {
        super();
        this.selectedDay = 0;
        this.search = null;

        this.filter();
    }
}

export var instance = new ConferenceViewModel();
