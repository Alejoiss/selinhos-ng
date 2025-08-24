import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService<P> {
    url = `${environment.apiUrl}api/`;

    constructor(
        public httpClient: HttpClient,
        @Inject(String) public endpoint: string
    ) { }

    /**
     * Método responsável por retornar uma lista-operacoes de itens de acordo com o query models.
     *
     * @param params parametros para a consulta.
     */
    public list(params: HttpParams = new HttpParams()): Observable<P[]> {
        return this.httpClient
            .get<P[]>(`${this.url}${this.endpoint}/`, {
                params
            });
    }

    /**
     * Método responsável por retornar uma operacao de itens de acordo com o query models.
     *
     * @param params parametros para a consulta.
     */
    public listOne(params: HttpParams = new HttpParams()): Observable<P> {
        return this.httpClient
            .get<P>(`${this.url}${this.endpoint}/`, {
                params
            });
    }

    /**
     * Método create envia uma requisição POST para a API informada na construção do Serviço.
     * Com os dados do model.
     *
     * @param item - model para criação.
     */
    public create(item: P): Observable<P> {
        return this.httpClient
            .post<P>(`${this.url}${this.endpoint}/`, item);
    }

    /**
     * Método update envia uma requisição PUT para a API informada na construção do Serviço.
     *
     * @param item - model a ser alterado
     */
    public update(item: P, id: any, params: HttpParams = new HttpParams()): Observable<P> {
        return this.httpClient
            .put<P>(`${this.url}${this.endpoint}/${id}/`, item, {
                params
            });
    }

    /**
     * Método read envia uma requisição GET para a API informada na construção do Serviço.
     * retorna um item encontrado pelo id passado por parâmetro.
     *
     * @param id - id do item que deseja pesquisar
     */
    public read(id: number | string): Observable<P> {
        return this.httpClient.get<P>(`${this.url}${this.endpoint}/${id}/`);
    }

    /**
     * Método rsponsável por remover um dado.
     *
     * @param id - id do valor que deseja remover.
     */
    delete(id: number | string): Observable<any> {
        return this.httpClient
            .delete(`${this.url}${this.endpoint}/${id}/`);
    }

    /**
     * Método responsável por retornar uma lista-operacoes de itens de acordo com o query models.
     *
     * @param params parametros para a consulta.
     */
    public listWithPagination(params: HttpParams = new HttpParams()): Observable<{
        count: number;
        next: string | null;
        previous: string | null;
        results: P[];
    }> {
        return this.httpClient
            .get<{
                count: number;
                next: string | null;
                previous: string | null;
                results: P[];
            }>(`${this.url}${this.endpoint}/`, {
                params
            });
    }
}
