import { Component } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { dashboardHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-dashboard',
    imports: [
        InternalHeader,
        NzAlertModule
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class Dashboard {
    headerConfig = dashboardHeaderConfig;

    constructor(public userService: UserService) {}
}
