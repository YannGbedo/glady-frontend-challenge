import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ShopCartService} from "../shop-cart.service";
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {BasicDialogComponent} from "../basic-dialog/basic-dialog.component";

@Component({
  selector: 'app-price-picker',
  templateUrl: './price-picker.component.html',
  styleUrls: ['./price-picker.component.sass']
})
export class PricePickerComponent implements OnInit{

  /**
   * Declaration of the various fields we are going to need:
   *
   * equalCards floorCards and ceilCards which serve to store said result, tagged with ! in case they don't exist
   * equalValue floorValue and ceilValue for the same purpose
   * searchForm a formGroup validating the searchInput from the user and allowing us to act on it
   * @Output newAmountEvent to send out an event when we change the input
   * isAmountValidated controls if the user actually confirmed he wants something
   * isAutoUpdateOn controls when the component will automatically update the form/combinations
   */
  equalCards!: number[];
  equalValue!: number;
  floorCards!: number[];
  floorValue!: number;
  ceilCards!: number[];
  ceilValue!:number;
  searchForm = new FormGroup({
    searchInput: new FormControl(NaN, [Validators.required, Validators.min(0)])
  });
  @Output() newAmountEvent = new EventEmitter<number>();
  isAmountValidated = false;
  isAutoUpdateOn = false;
  constructor(
    private shopCartService: ShopCartService,
    public dialog: MatDialog
  ) {}

  /**
   * function to autocorrect the input
   * turns on auto updates so the component knows to also update the combinations
   * @param val - updated amount
   */
  amountChange(val: number) {
    console.log('changing input value: ' + val );
    this.searchForm.setValue({
      searchInput: val
    });
    this.newAmountEvent.emit(val);
    this.isAutoUpdateOn = true;
  }

  //resets all the values to avoid visual bugs
  reset(): void {
    this.equalCards = [];
    this.floorCards = [];
    this.ceilCards = [];
    this.equalValue = NaN;
    this.floorValue = NaN;
    this.ceilValue = NaN;
  };

  /**
   * starts a search from the shopCartService that queries the Calculator API
   * @param amount - amount desired
   */
  searchCombinations(amount: number) {
    //reset the combinations as empty
    this.reset();

    this.shopCartService.searchCombinations(amount).forEach(obj => {
      Object.entries(obj).forEach(([key, value]) => {
        // assign the new values to the combinations
        switch (key) {
          case 'equal':
            this.equalValue = value.value;
            this.equalCards = value.cards;
            break;
          case 'floor':
            this.floorValue = value.value;
            this.floorCards = value.cards;
            break;
          case 'ceil':
            this.ceilValue = value.value;
            this.ceilCards = value.cards;
            break;
          default:
            console.log('no combination found');
            this.equalCards = [];
            this.floorCards = [];
            this.ceilCards = [];
            break;
        }
        console.log('equal :' + this.equalValue + ' with ' + this.equalCards);
        console.log('floor :' + this.floorValue + ' with ' + this.floorCards);
        console.log('ceiling :' + this.ceilValue + ' with ' + this.ceilCards);
      });
    }).then(value => {
      //automatically change to the nearest value if there's only a ceiling or a floor
      if (isNaN(this.equalValue)) {
        if (isNaN(this.ceilValue) && this.floorValue) {
          this.amountChange(this.floorValue);
        } else if (this.ceilValue && isNaN(this.floorValue)) {
          this.amountChange(this.ceilValue);
        }
      }
    });
  };

  /**
   * updates the vue with the next combination possible if there is one
   * @param currentValue - amount currently in the form input
   */
  nextCombination(currentValue: number) {
    //checks if anything has been entered yet
    if (!currentValue) {
      this.dialog.open(BasicDialogComponent, {
        width: '250px',
        enterAnimationDuration: '1000ms',
        exitAnimationDuration: '500ms',
        data: 'Il semble manquer quelquechose, essaie d\'entrer un montant ?'
      });
    } else {
      this.isAmountValidated = true;

      /**
       * since we assume only integers are possible, we start a search on the next integer possible
       * updates to new ceiling value if it exists and is bigger than the current one
       */
      this.shopCartService.searchCombinations(currentValue + 1).forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
          // assign the new values to the combinations
          switch (key) {
            case 'equal':
              this.equalValue = value.value;
              this.equalCards = value.cards;
              break;
            case 'floor':
              this.floorValue = value.value;
              this.floorCards = value.cards;
              break;
            case 'ceil':
              this.ceilValue = value.value;
              this.ceilCards = value.cards;
              break;
            default:
              console.log('no combination found');
              this.equalCards = [];
              this.floorCards = [];
              this.ceilCards = [];
              break;
          }
          console.log('equal :' + this.equalValue + ' with ' + this.equalCards);
          console.log('floor :' + this.floorValue + ' with ' + this.floorCards);
          console.log('ceiling :' + this.ceilValue + ' with ' + this.ceilCards);
        });
      }).then(value => {
        if (isNaN(this.equalValue)) {
          if (isNaN(this.ceilValue) && this.floorValue) {
            this.amountChange(this.floorValue);
          } else if (this.ceilValue && isNaN(this.floorValue)) {
            this.amountChange(this.ceilValue);
          }
        } else if (currentValue < this.ceilValue) {
          this.amountChange(this.ceilValue);
        } else if (currentValue == this.ceilValue) {
          this.dialog.open(BasicDialogComponent, {
            width: '250px',
            enterAnimationDuration: '1000ms',
            exitAnimationDuration: '500ms',
            data: 'Pas plus!'
          });
        }
      });
    }
  };

  /**
   * updates with the previous combination possible if there is one
   * @param currentValue - amount currently in the form input
   */
  previousCombination(currentValue: number) {
    if (!currentValue) {
      this.dialog.open(BasicDialogComponent, {
        width: '250px',
        enterAnimationDuration: '1000ms',
        exitAnimationDuration: '500ms',
        data: 'Il semble manquer quelquechose, essaie d\'entrer un montant ?'
      });
    } else {
      this.isAmountValidated = true;

      /**
       * since we assume only integers are possible, we start a search on the next integer possible
       * updates to new floor value if it exists and is lower than the current one
       */
      this.shopCartService.searchCombinations(currentValue - 1).forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
          // assign the new values to the combinations
          switch (key) {
            case 'equal':
              this.equalValue = value.value;
              this.equalCards = value.cards;
              break;
            case 'floor':
              this.floorValue = value.value;
              this.floorCards = value.cards;
              break;
            case 'ceil':
              this.ceilValue = value.value;
              this.ceilCards = value.cards;
              break;
            default:
              console.log('no combination found');
              this.equalCards = [];
              this.floorCards = [];
              this.ceilCards = [];
              break;
          }
          console.log('equal :' + this.equalValue + ' with ' + this.equalCards);
          console.log('floor :' + this.floorValue + ' with ' + this.floorCards);
          console.log('ceiling :' + this.ceilValue + ' with ' + this.ceilCards);
        });
      }).then(value => {
        if (isNaN(this.equalValue)) {
          if (isNaN(this.ceilValue) && this.floorValue) {
            this.amountChange(this.floorValue);
          } else if (this.ceilValue && isNaN(this.floorValue)) {
            this.amountChange(this.ceilValue);
          }
        } else if (currentValue > this.floorValue) {
          this.amountChange(this.floorValue);
        } else if (currentValue == this.floorValue) {
          this.dialog.open(BasicDialogComponent, {
            width: '250px',
            enterAnimationDuration: '1000ms',
            exitAnimationDuration: '500ms',
            data: 'Pas moins!'
          });
        }
      });
    }
  };

  //validate button function, turns isAmountValidated true and starts the search
  validateAmount(): void {
    let amount = this.searchForm.get('searchInput')?.value;

    if (typeof amount === 'number') {
      console.log(amount + ' validated, start search');
      this.isAmountValidated = true;
      this.searchCombinations(amount);
    }

  };

  ngOnInit(): void {
    //initialise the combinations as empty
    this.reset();

    //listen to changes on the searchForm and update data accordingly
    this.searchForm.get('searchInput')?.valueChanges
      .pipe(
        /**
         * wait a little after every number entered before doing anything
         * was mainly relevant at first because I had let the app auto search when you enter any amount
         * in that scenario it was impossible to enter anything unless the app gave you a little bit of time
         * ultimately I stopped that to conform with the exercise
         */
        debounceTime(0),

        // ignore changes unless something actually new is entered
        distinctUntilChanged(),
      )
      .subscribe(val => {
        if (!val) {
          this.reset()
          this.isAmountValidated = false;
        } else if (this.isAmountValidated && this.isAutoUpdateOn) {
          this.searchCombinations(val);
          this.isAutoUpdateOn = false;
        }
      });
  };
}
