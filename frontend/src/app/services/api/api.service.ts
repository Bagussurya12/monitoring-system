import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private __token: string|null;

  constructor() {
    this.__token = localStorage.getItem(environment.api_token_identifier)
  }

  public get(url: string, params: any = {}) {
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.__token}`
      },
      params: params
    })
  }

  public post(url: string, data: any = {}) {
    return axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.__token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  public put(url: string, data: any = {}) {
    return axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${this.__token}`
      }
    })
  }

  public delete(url: string) {
    return axios.delete(url, {
      headers: {
        Authorization: `Bearer ${this.__token}`
      }
    })
  }
}

