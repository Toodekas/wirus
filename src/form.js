import { takeWhile, debounceTime, filter } from "rxjs/operators";

this.newCardForm.valueChanges
  .pipe(
    filter((value) => this.newCardForm.valid),
    debounceTime(500),
    takeWhile(() => this.alive)
  )
  .subscribe((data) => {
    console.log(data);
  });
