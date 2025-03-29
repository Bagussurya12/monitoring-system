import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  // username = '';
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private router: Router) {}

  onKeyPress(event: KeyboardEvent) {
    if(event.key == 'Enter') {
      this.login();
    }
  }

  async login() {
    this.errorMessage = '';
    this.loading = false;

    if (this.username === null || this.username === undefined || this.username.length <= 0) {
      this.errorMessage = 'Please enter your username';
      return;
    }

    if (this.password === null || this.password === undefined || this.password.length <= 0) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    this.loading = true;

    try {
      const res = await axios.post(`${environment.api_url}/login`, {
        username: this.username,
        password: this.password
      }, {
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json'
        }
      });
      const data = await res.data;
      this.loading = false;
      if (data.error) {
        this.errorMessage = data.error_message;
        window.scrollTo(0,0);
        return;
      }

      const token = data.api_token;
      window.localStorage.setItem(environment.api_token_identifier, token);
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.errorMessage = 'Sorry, something went wrong. Please try again later!';
    }
  }

  ngOnInit(): void {

  }
}
