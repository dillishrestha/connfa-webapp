import {Component, OnInit} from "@angular/core";
import {FavoritesComponent} from "../events_partials/favorites.component";
import {ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {BofsListComponent} from "./bofs-list.component";
import {EventService} from "../../services/event.service";
import {Event} from "../../models/event";
import moment from 'moment';

@Component({
    selector: 'event-details',
    templateUrl: 'app/views/events_partials/details.html',
    directives: [FavoritesComponent, BofsListComponent, ROUTER_DIRECTIVES],
})

export class BofDetailComponent implements OnInit {

    public event;
    public parentRoute = '/bofs';
    public title = 'BOFs';
    public canView;

    constructor(private _eventService:EventService, private _router:ActivatedRoute) {
    }

    ngOnInit():any {

        this._router.params.subscribe(params => {
            var id = params['id'];
            this._getEvent(id).then((event:Event) => {
                var activeDate = moment(event.from, moment.ISO_8601).format('ddd D');
                this._eventService.setActiveDate(activeDate);
            });

            this._eventService.eventsChanged$.subscribe((data) => {
                this._getEvent(id);
            })
        })
    }

    private _getEvent(id) {
        return this._eventService.getEvent(id, 'bof').then((event:Event) => {
            return new Promise((resolve, reject) => {
                this.event = event;
                resolve(event);
                if (!event || this._eventService.isNonClickable(event.type)) {
                    this.canView = false;
                } else {
                    this.canView = true;
                }
            });
        });
    }
}
