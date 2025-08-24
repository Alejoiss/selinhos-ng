import { Component, OnInit } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { InternalHeader } from '../../../components/internal-header/internal-header';
import { companyHeaderConfig } from '../../../components/internal-header/internal-header-configs';
import { CardOnFile } from '../../../models/card-on-file/card-on-file';
import { Company } from '../../../models/company/company';
import { CardOnFileService } from '../../../services/card-on-file/card-on-file.service';
import { CompanyService } from '../../../services/company/company.service';
import { EditCompany } from './edit-company/edit-company';

@Component({
    selector: 'app-company',
    imports: [
        InternalHeader,
        NzSpinModule,
        EditCompany
    ],
    templateUrl: './company.html',
    styleUrl: './company.scss'
})
export class CompanyComponent implements OnInit {
    headerConfig = companyHeaderConfig;
    loadingCompany = true;
    loadingCardOnFile = true;

    company!: Company;
    cardOnFile!: CardOnFile;

    constructor(
        private companyService: CompanyService,
        private cardOnFileService: CardOnFileService
    ) { }

    ngOnInit(): void {
        this.loadCompanyData();
        this.loadCardOnFileData();
    }

    loadCompanyData(): void {
        this.loadingCompany = true;
        this.companyService.list().subscribe({
            next: (data) => {
                this.company = data[0];
                this.loadingCompany = false;
            },
            error: () => {
                this.loadingCompany = false;
            }
        });
    }

    loadCardOnFileData(): void {
        this.loadingCardOnFile = true;
        this.cardOnFileService.list().subscribe({
            next: (data) => {
                this.cardOnFile = data[0];
                this.loadingCardOnFile = false;
            },
            error: () => {
                this.loadingCardOnFile = false;
            }
        });
    }
}
