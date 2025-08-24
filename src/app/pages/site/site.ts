import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Plan } from '../../models/plan/plan';
import { PlanService } from '../../services/plan/plan.service';
import { RegisterUserService } from '../../services/register-user/register-user.service';

@Component({
    selector: 'app-site',
    imports: [
        DecimalPipe,
        RouterModule
    ],
    templateUrl: './site.html',
    styleUrl: './site.scss'
})
export class Site implements OnInit {
    plans: Plan[] = [];

    constructor(
        private planService: PlanService,
        private registerUser: RegisterUserService,
        private router: Router
    ) { }

    ngOnInit() {
        this.planService.list().subscribe(plans => {
            this.plans = plans;
        });
    }

    getThisPlan(plan: Plan) {
        window.localStorage.setItem('selected_plan_id', plan.id.toString());
        this.registerUser.form.patchValue({ plan_id: plan.id });
        this.router.navigate(['/registro']);
    }
}
