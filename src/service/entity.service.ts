import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { WebSocketService } from './websocket.service';

import { Entity } from '../object/entity';
// Operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


const WEBSOCKET_URL = 'ws://localhost:8180/export-web/entity/1';

/*export interface Message {
	author: string,
	message: string,
	newDate?: string
}*/

@Injectable()
export class EntityService {
  private entityUrl = 'http://localhost:8180/export-web/rest/entity';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  public entitySocket: Subject<Entity>;

  constructor(private http: HttpClient, wsService: WebSocketService) {
    this.entitySocket = <Subject<Entity>>wsService.connect(WEBSOCKET_URL)
      .map((response: MessageEvent): Entity => {
        // Parsing websocket data as json
        const data = JSON.parse(response.data);
        return {
          object: data.object,
          operation: data.operation,
          id : data.id
        };
      });
    }

  getEntityList(): Promise<Entity[]> {
    this.http.get(this.entityUrl).toPromise().then(response => console.log(response));
      return this.http.get<Entity[]>(this.entityUrl).toPromise()
        .catch(this.handleError);
  }

  getEntity(id: number): Promise<Entity> {
    return this.getEntityList().then(entityList => entityList.find(entity => entity.id === id));
  }

  update(entity: Entity): Promise<Entity> {
    const url = `${this.entityUrl}/${entity.id}`;
    return this.http.put(url, JSON.stringify(entity), {headers: this.headers}).toPromise()
            .then(() => entity)
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
