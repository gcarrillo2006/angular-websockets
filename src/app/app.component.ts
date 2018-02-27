import { Component, OnInit } from '@angular/core';
// Custom websocket service created by Germán Carrillo
import { WebSocketService } from '../service/websocket.service';
// Custom entity service that access to the json object
import { EntityService } from '../service/entity.service';
// Json object sent from JEE 7 server
import { Entity } from '../object/entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ WebSocketService, EntityService ]
})
export class AppComponent implements OnInit {
  title = 'app';

  private entityListWS: Entity[] = []; // Inicialization is required otherwise the websocket is going to throw undefined

  private entityListRest: Entity[];

  constructor(private entityService: EntityService) {
    entityService.entitySocket.subscribe(entity => {
      this.entityListWS.push(entity);
    });
  }

  ngOnInit() {
    this.getEntityListRest(); // Load the entityArray inmediately
  }

  getEntityListRest(): void {
    this.entityService.getEntityList().then(array => this.entityListRest = array);
  }
}
