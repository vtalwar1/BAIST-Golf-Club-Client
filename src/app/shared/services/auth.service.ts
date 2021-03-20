import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { ResetPasswordFormModule } from '../components';
import { User } from '../models/user';
import { UserService } from './user.service';
import { mergeMap, tap } from 'rxjs/operators';


const defaultPath = '/';


@Injectable()
export class AuthService {
  private validUsers = [
    {
      id: 1122334455,
      email: 'staff@nait.ca',
      password: '1234',
      type: 'Staff'
    },
    {
      id: 2233445566,
      email: 'member@nait.ca',
      password: '1234',
      type: 'Member'
    },
    {
      id: 3344556677,
      email: 'shareholdermember@nait.ca',
      password: '1234',
      type: 'ShareholderMember'
    },
  
  ]
  private _user: User;
  get loggedIn(): boolean {
    if(this._user)
      return true;
    else 
      return false;
  }

  get hasActiveSession(): boolean {
    let sessionToken = sessionStorage.getItem('sessionToken');
    if(sessionToken)
      return true;
    else 
      return false;
  }

  get getActiveSessionToken(): string {
    return sessionStorage.getItem('sessionToken');
  }
  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }
  public navItems: any;

  constructor(private router: Router, private userService: UserService) { }

  logIn(email: string, password: string = "password"): Observable<User> {
         // Send request
      console.log(email, password);
      return this.userService.getUserByEmail(email).pipe(tap((result) => {
        if (result != null) {
          this._user = result;
          this._user.fullName = this._user.firstName + ' ' + this._user.lastName; 
          sessionStorage.setItem('sessionToken', this._user.userId);
          this.navItems = this.createNavItems();
        }
      }));
    }

    logInSilent(sessionToken: string, password: string = "password"): Observable<User> {
      // Send request
   console.log(sessionToken, password);
   return this.userService.getUserById(sessionToken).pipe(tap((result) => {
     if (result != null) {
       this._user = result;
       this._user.fullName = this._user.firstName + ' ' + this._user.lastName; 
       sessionStorage.setItem('sessionToken', this._user.userId);
       this.navItems = this.createNavItems();
     }
   }));
 }

  getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false
      };
    }
  }

  async createAccount(email, password) {
    try {
      // Send request
      console.log(email, password);

      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    };
  }

  async resetPassword(email: string) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  async logOut() {
    this._user = null;
    sessionStorage.removeItem('sessionToken');
    this.router.navigate(['/login-form']);
  }

  createNavItems(): any {
    return [
      {
        text: 'Home',
        path: '/home',
        icon: 'home'
      },
      {
        text: 'Reservations',
        icon: 'event',
        items: [
          {
            text: 'New Reservation ',
            path: '/create-reservation'
          },
          {
            text: 'Reservation List',
            path: '/reservation-list'
          },
          {
            text: 'Approve Reservations',
            path: '/approve-standing-reservation',
            visible: this._user.isStaff
          }
        ]
      },
      {
        text: 'Scores',
        icon: 'event',
        items: [
          {
            text: 'Submit Score',
            path: '/submit-score'
          }
        ]
      }
    ];
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  private _isInitialized: boolean = false;
  private _appInitSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const isLoggedIn = this.authService.loggedIn;
    // const isAuthForm = [
    //   'login-form',
    //   'reset-password',
    //   'create-account',
    //   'change-password/:recoveryCode'
    // ].includes(route.routeConfig.path);

    // if (isLoggedIn && isAuthForm) {
    //   this.authService.lastAuthenticatedPath = defaultPath;
    //   this.router.navigate([defaultPath]);
    //   return false;
    // }

    // if (!isLoggedIn && !isAuthForm) {
    //   this.router.navigate(['/login-form']);
    // }

    // if (isLoggedIn) {
    //   this.authService.lastAuthenticatedPath = route.routeConfig.path;
    // }

    // return isLoggedIn || isAuthForm;

    return this.waitForInitialization.pipe(
      mergeMap((x: boolean) => {
        if (x)
          return this.hasPermission(route);
        else
          return of(x);


      })
    );
  }

  public get waitForInitialization(): Observable<boolean> {
    return (this._isInitialized) ? of(true) : this._appInitSubject.asObservable();
  }

  public setAppInitialized(): void {
    this._isInitialized = true;
    this._appInitSubject.next(true);
    this._appInitSubject.complete();
  }

  private hasPermission(route: ActivatedRouteSnapshot): Observable<boolean> {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ].includes(route.routeConfig.path);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return of(false);
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig.path;
    }

    return of(isLoggedIn || isAuthForm);
  }
}
