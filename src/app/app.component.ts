import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';
import { Observable, Subject } from 'rxjs';
import { User } from './user';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'POC-Entrinsic';
  users;
  loading: boolean = false;
  users$: Observable<User[]>;
  private searchTerms = new Subject<string>();

  constructor(private service: UserService) { }

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.service.getAll().subscribe(users => this.users = users);
    this.users$ = this.searchTerms.pipe(
      tap(_ => this.loading = true),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.service.searchUser(term)),
      tap(_ => this.loading = false)
    )

  }
}
