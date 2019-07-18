import { Component, OnInit, Input, Output } from '@angular/core';
import {Task} from '../models/Task.model';
import {TaskManagerService} from '../service/task-manager.service';
import { ToastrService } from 'ngx-toastr';
import {ProjectManagerService} from '../service/project-manager.service'
import {UserService} from '../service/user.service';
import {User} from '../models/User.model';
import {FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  constructor(private formBuilder :FormBuilder,private projectManagerService:ProjectManagerService,private userService:UserService,private taskManagerService :TaskManagerService,private toastr:ToastrService) { }
  invalidMessageDisplay='';
  taskData= new Task;
  addTaskFormGroup :FormGroup =null;
  public projects=[];
  public users=[];
  public tasks=[];
  isChecked:boolean=false;
  
  ngOnInit() {
    this.addTaskFormGroup = this.formBuilder.group({  
      'task': new FormControl(this.taskData.task,
       [Validators.required,Validators.minLength(5)]),
       'projectID' :new FormControl(this.taskData.projectID,
        [Validators.required]),
        'priority' :new FormControl(this.taskData.priority,
          [Validators.required]),
          'startDate' :new FormControl(this.taskData.startDate,
            [Validators.required]),
            'toDate' :new FormControl(this.taskData.endDate,
              [Validators.required]),
              'user' :new FormControl(this.taskData.userID,
                [Validators.required])
          
          // 'projectID' :new FormControl(this.taskData.task,
          //   [Validators.required])
      //  'lastName': new FormControl(this.user.lastName,Validators.required),
      //  'employeeID': new FormControl(this.user.employeeID, Validators.required)
    });
    this.userService.viewUsers().subscribe(data =>{        
      this.users=data;
    });
    this.projectManagerService.viewProjects().subscribe(data =>{                    
      this.projects=data;
  });
  this.taskManagerService.viewtask().subscribe((data) =>{                    
    this.tasks=data;
     });
  }
  get f() { return this.addTaskFormGroup.controls; }
 AddTask()
  {
    if(this.addTaskFormGroup.valid){
    this.taskManagerService.addTask(this.taskData).subscribe(data =>{                    
           if(data){
              alert("Task Added Successfully!");
              //this.toastr.success("Task Added Successfully!", "Task Message.");
               this.resetForm();
              }
    });
  }

  }
  resetForm()
  {
    this.addTaskFormGroup.reset();
    this.taskData= new Task;
  }
  validateParentTask()
  {
    this.taskManagerService.validateParentTask(this.taskData.parentTask).subscribe((data) =>{
                   
      this.taskData.ParentTaskID=data;
     },
    error =>{
      alert("Invalid Parent task");
      this.taskData.parentTask="";
      this.taskData.ParentTaskID=null;
    });
  }

}
