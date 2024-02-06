# Ngx Autocomplete

An easy to use and flexible Autocomplete angular component.

## Usage

Install npm module.

```bash
npm i ngx-autocomplete
```

## Dependencies

This package relies on the following peer dependencies:

- **@angular/cdk**: ^12.0.0

Please make sure to install them in your project before using this package.

Now import the module in your angular module, e.g. ``app.module.ts``:

```ts
import { AutocompleteModule } from 'ngx-autocomplete';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AutocompleteModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
In your template file, add the ``ngx-autocomplete`` tag to use component, e.g.:

```html
<ngx-autocomplete [searchMethod]="searchMethod" viewKey="email"></ngx-autocomplete>
```

## Configuration

You can pass the following attributes values of supported types for further customizations:

<table>
<thead>
<tr>
<th>Attribute</th>
<th>Supported Type</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
  
  <tr>
    <td>
      <code>minimumCharacterForSearch</code>
    </td>
    <td>
      number
    </td>
    <td>
      0
    </td>
    <td style="vertical-align: top;">
      Minumum character needs to start searching.
    </td>
  </tr>

  <tr>
    <td><code>debounceTime</code></td>
    <td>number</td>
    <td>500</td>
    <td style="vertical-align: top;">
          Miliseconds after user finished typing search term 
      for triggering search method
        </td>
  </tr>

  <tr>
    <td>
      <code>suggestionItemClass</code>
    </td>
    <td>string</td>
    <td>-</td>
    <td style="vertical-align: top;">
      Custom CSS class applies tp every search result item.
    </td>
 </tr>

  <tr>
    <td>
      <code>suggestionContainerHeight</code>
    </td>
    <td>number</td>
    <td>150</td>
    <td style="vertical-align: top;">
      Search result dropdown height in pixell.
    </td>
  </tr>

  <tr>
    <td>
      <code>searchMethod</code>
    </td>
    <td>
        OperatorFunction<string, T[]> | null | undefined</td>
    <td>-</td>
    <td style="vertical-align: top;">
      A function wich recoeves search term as an obcervable of string and returns array of search item as result.
    </td>
  </tr>

  <tr>
    <td>
      <code>suggestionKey</code>
    </td>
    <td>string</td>
    <td>-</td>
    <td style="vertical-align: top;">
        Object field for rendering for every search result item in search result drop down.
        If suggestionMethod was provided, suggestionMethod result uses for rendering item.
    </td>
  </tr>

  <tr>
    <td>
      <code>suggestionMethod</code>
    </td>
    <td>(item?: T) => string</td>
    <td>-</td>
    <td style="vertical-align: top;">
        Object field for rendering for every search result item in search result drop down.
        If suggestionMethod was provided, suggestionMethod result uses for rendering item.
    </td>
  </tr>

  <tr>
    <td>
      <code>idKey</code>
    </td>
    <td>string</td>
    <td>id</td>
    <td style="vertical-align: top;">
        Item field name uses in track by function for rendering search result items.
    </td>
  </tr>

  <tr>
    <td>
      <code>viewKey</code>
    </td>
    <td>string</td>
    <td>-</td>
    <td style="vertical-align: top;">
        Object field for showing selected item in search input.
    </td>
  </tr>

  <tr>
    <td>
      <code>viewMethod</code>
    </td>
    <td>(selection?: T) => string</td>
    <td>-</td>
    <td style="vertical-align: top;">
        The function that converts an item from the result list to a string to display in the input.
        It is called when the user selects something in the popup or the model value changes, so the input needs to be updated
    </td>
  </tr>

  <tr>
    <td>
      <code>placeholder</code>
    </td>
    <td>string</td>
    <td>-</td>
    <td style="vertical-align: top;">
        Search input placeholder attribute value.
    </td>
  </tr>

  <tr>
    <td>
      <code>noSuggestionText</code>
    </td>
    <td>string</td>
    <td>"no item found."</td>
    <td style="vertical-align: top;">
        Text shows when search result is empty.
    </td>
  </tr>

  <tr>
    <td>
      <code>clearButton</code>
    </td>
    <td>boolean</td>
    <td>true</td>
    <td style="vertical-align: top;">
        boolean value to show  button for removing selected suggestion.
    </td>
  </tr>

  <tr>
    <td>
      <code>forceSuggestion</code>
    </td>
    <td>boolean</td>
    <td>true</td>
    <td style="vertical-align: top;">
        If set to false the input value use as selected item.
    </td>
  </tr>

  <tr>
    <td>
      <code>suggestionSelect</code>
    </td>
    <td>EventEmitter</td>
    <td>-</td>
    <td style="vertical-align: top;">
        The event that fiers after user has selected an item.
        The event handler recieves selected item as event argument.
    </td>
  </tr>

</tbody>
</table>

### Using custome templates
There are four directive for customising autocomplete appearance as follow.

```html
<ngx-autocomplete [searchMethod]="searchMethod" viewKey="email">
  <!-- template shows in search result pop-up header -->
  <ng-template ngxSuggestionHeader>
      <h3>Employees</h3>
  </ng-template>

  <!-- template shows for every item in search result pop-up  -->
  <ng-template let-item ngxSuggestionContent>
      <span>Email Address {{item.emal}}</span>
  </ng-template>

  <!-- template shows empty search result pop-up  -->
    <ng-template ngxNoSuggestion>
      <span>search result is empty !!!</span>
  </ng-template>

  <!-- template shows for search result pop-up footer  -->
  <ng-template ngxSuggestionFooter>
      <span>Here is the footer</span>
  </ng-template>

</ngx-autocomplete>
```
## License

@salmanian_hossein/ngx-autocomplete is free and licensed under the [MIT License](./LICENSE).
