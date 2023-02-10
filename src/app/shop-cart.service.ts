import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {CalculatorResults} from "./calculator-results";

@Injectable({
  providedIn: 'root'
})
export class ShopCartService {

  constructor(
    private http: HttpClient
  ) { }
  private calculatorUrl = 'http://localhost:3000/';

  private getCalculatorUrl(shopId: number, query: string):string {
    return this.calculatorUrl + 'shop/' + shopId + '/' + query + '?'
  }

  /**
   * GET potential card combinations to choose from
   * The WedooStore has a shopId of 5
   * Uses the search-combinations method of the API
   * Return empty when val is empty
   * Always return the closest option
   * @param val - amount desired
   */
  searchCombinations(val: number): Observable<CalculatorResults> {
    console.log('search start with ' + val);

    let paramObject: any = { amount: val };
    let httpParams: HttpParamsOptions = {fromObject: paramObject} as HttpParamsOptions;
    let httpOptions = {
      params: new HttpParams(httpParams),
      headers: new HttpHeaders({Authorization:'tokenTest123'})
    };
    if (!val || val == NaN) {
      // if nothing is entered yet, return empty results
      return of({});
    }
    return this.http.get<CalculatorResults>(this.getCalculatorUrl(5, 'search-combination'), httpOptions).pipe(
      tap(res => res ?
        // simple check if there's a result or not, mainly for debug
        console.log(`found bundles matching: ${val}`) :
        console.log(`no bundles matching: ${val}`)),
      catchError(this.handleError<CalculatorResults>('searchOptions', {}))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
