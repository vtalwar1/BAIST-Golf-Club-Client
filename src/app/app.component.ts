import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ScreenService, AppInfoService, AuthGuardService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  title: string;
  description: string;

  constructor(public authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, private router: Router
    , private authGuardService: AuthGuardService) {
    if(!this.hasActiveSession()) {
      this.router.navigate(['/login-form']);
      this.authGuardService.setAppInitialized();
    } else {
      this.authService.logInSilent(this.getActiveSessionToken()).subscribe(result => {
        if(result) {          
          this.authGuardService.setAppInitialized();
          
        }
          else
        {
          this.title = "Active Session";
          this.description = "Can not find user with the active seesion token in the database."
        }
      },
      error => {
        this.title = "Active Session";
        this.description = "Can not find user with the active seesion token in the database."
      });
    }

    
    
   }
  

  isAuthenticated() {
    return this.authService.loggedIn;
  }

  hasActiveSession() {
    return this.authService.hasActiveSession;
  }

  getActiveSessionToken() {
    return this.authService.getActiveSessionToken;
  }

  
}
