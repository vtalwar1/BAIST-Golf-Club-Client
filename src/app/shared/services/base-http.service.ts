import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected baseApiURL = environment.baseApiURL;
  constructor() { }
}
