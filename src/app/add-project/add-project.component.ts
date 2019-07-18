import { Component, OnInit } from '@angular/core';
import {Project} from '../models/Project.model';
import {ProjectManagerService} from '../service/project-manager.service'
import {UserService} from '../service/user.service';
import {User} from '../models/User.model';
import { DatePipe } from '@angular/common';
import * as _ from "lodash";
import * as moment from 'moment';
import {FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  
    constructor(private formBuilder :FormBuilder,private datePipe:DatePipe,private projectManagerService:ProjectManagerService,private userService:UserService) { }
    project=new Project;
   
    projectModal=new Project;
    public projects=[];
    public users=[];
    display='';
    addProjectFormGroup: FormGroup =null;
    isChecked: boolean = false;
    checked:boolean;
    public filterProject = '';
   
    ngOnInit() {
      this.addProjectFormGroup = this.formBuilder.group({  
        'project': new FormControl(this.project.project,
         [Validators.required,Validators.minLength(5)]),
         'rangePriority' :new FormControl(this.project.priority,
          [Validators.required]),
             'manager' :new FormControl(this.project.manager,
                [Validators.required])
        
      });
      this.projectManagerService.viewProjects().subscribe(data =>{                    
        this.projects=data;
    });
    this.userService.viewUsers().subscribe(data =>{        
      this.users=data;
  });
  }
  get f() { return this.addProjectFormGroup.controls; }

 
  AddProject(){
    if(this.addProjectFormGroup.valid){
     this.projectManagerService.addProject(this.project).subscribe(data=>{
    if(data){
      alert("Project Added Successfully!");
      this.resetForm();
      this.ngOnInit();
             }
      });
    }
  }
  resetForm(){
    this.project=new Project;
    this.project.priority=0;
    this.isChecked=false;
    this.addProjectFormGroup.reset();
  }
  editProject(){
    this.projectManagerService.editProject(this.projectModal).subscribe(data=>{
      if(data){
        alert("Details updated Successfully!");
        this.closeModalDialog();         
               }
        });
  }
  deleteProject(projectId:number){
     this.projectManagerService.deleteProject(projectId).subscribe(data=>{
    alert(data);
    this.ngOnInit();
      });
  }
  
  sortProjects(sortBy: string) {
       this.projects = _.orderBy(this.projects, [sortBy], ["asc"]);
   }
  
   setStartEndDates() {
     
    this.datePipe = new DatePipe('en-US');
      this.project.startDate= this.isChecked ? new Date(): null,
      this.project.endDate= this.isChecked ? moment().add({ days: 1 }).toDate() : null
     
    }
 
  
  openModalDialog(projectModal){
      this.projectModal=projectModal;
      this.display='block'; 
  }
  
  closeModalDialog(){
   this.display='none'; 
   }
  }