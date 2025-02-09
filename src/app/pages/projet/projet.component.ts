import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { AuthService } from '../../core/services/firebase/auth.service';
import { FirestoreService } from '../../core/services/firebase/firestore.service';
import { FieldValue, Timestamp } from '@angular/fire/firestore';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SetProjectComponent } from '../home/project/set-project/set-project.component';
import { MatCardModule } from '@angular/material/card';
import { SetTodoComponent } from './todo/set-todo.component';
import { Task } from '../../core/models/Task.model';
import { TodoComponent } from "./todo/todo.component";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-projet',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatTooltipModule,
    RouterLink,
    MatDividerModule,
    DatePipe,
    MatCardModule,
    TodoComponent,
    CdkDrag,
    CdkDropList,
],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss',
})
export default class ProjetComponent implements OnInit, OnDestroy {
archiveProject(arg0: Project<Timestamp>|undefined) {
throw new Error('Method not implemented.');
}
  id = input('id');
  projectSub?: Subscription;
  project?: Project<Timestamp>;
  readonly dialog = inject(MatDialog);
  readonly title = inject(Title);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  readonly user$ = this.auth.user;

  todos$?: Observable<Task<Timestamp>[]>;
  inProgresses$?: Observable<Task<Timestamp>[]>;
  dones$?: Observable<Task<Timestamp>[]>;


  ngOnInit(): void {
    this.todos$ = this.fs.getTodos(this.id(), 'backlog');
    this.inProgresses$ = this.fs.getTodos(this.id(), 'in-progress');
    this.dones$ = this.fs.getTodos(this.id(), 'done');

    this.projectSub = this.fs
      .getDocData(this.fs.projectCol, this.id())
      .subscribe((project) => {
        this.project = project as Project<Timestamp>;
        this.title.setTitle(`${this.project.title} - ngMradi`);
      });
  }

  formatedDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);

  onSetTodo(projectId: string) {
    this.dialog.open(SetTodoComponent, {
      width: '35rem',
      disableClose: true,
      data: { projectId },
    });
  }

  onEditProject(project: Project<Timestamp>) {
    this.dialog.open(SetProjectComponent, {
          width: '35rem',
          disableClose: true,
          data: project
        });
  }


  onDeleteProject(projectId: string) {
    this.fs.deleteData(this.fs.projectCol, projectId);
    const message = 'Projet suprimé avec succès';
    this.snackBar.open(message, '', { duration: 5000 });
  }


  drop(
    event: CdkDragDrop<Task<Timestamp>[] | null>,
    status: 'backlog' | 'in-progress' | 'done'
  ){
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data![
        event.previousIndex
      ] as Task<FieldValue>;

      task.moved = true;
      task.status = status;
      this.fs.setTask(this.id(), task)
    }
  }

  ngOnDestroy(): void {
    this.projectSub?.unsubscribe();
  }
}
