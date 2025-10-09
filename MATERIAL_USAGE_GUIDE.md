# Angular Material Usage Guide

## 📦 Installation Complete

Angular Material has been installed with:
- **@angular/material**: v20.2.8
- **@angular/cdk**: v20.2.8 (Component Dev Kit)
- **Theme**: Azure/Blue (Material 3)
- **Fonts**: Roboto & Material Icons

## 🎨 How to Use Material Components

Since this project uses **Standalone Components**, you import Material modules directly in your component's `imports` array.

### Example: Using Material Components

```typescript
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Hello Material</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>This is a Material card!</p>
        <button mat-raised-button color="primary">
          <mat-icon>favorite</mat-icon>
          Click Me
        </button>
      </mat-card-content>
    </mat-card>
  `
})
export class ExampleComponent {}
```

## 📚 Commonly Used Material Modules

### Layout & Structure
```typescript
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
```

### Buttons & Indicators
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
```

### Form Controls
```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
```

### Navigation
```typescript
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
```

### Popups & Modals
```typescript
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
```

### Data Display
```typescript
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
```

## 🎨 Theming

The Azure/Blue theme is configured in `src/styles.scss`. You can customize it:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}
```

### Dark Mode Support

To enable dark mode, modify `src/styles.scss`:

```scss
body {
  color-scheme: dark; // Change from 'light' to 'dark'
}
```

### Custom Colors

Material provides these palettes out of the box:
- `mat.$red-palette`
- `mat.$pink-palette`
- `mat.$purple-palette`
- `mat.$indigo-palette`
- `mat.$blue-palette`
- `mat.$cyan-palette`
- `mat.$teal-palette`
- `mat.$green-palette`
- `mat.$yellow-palette`
- `mat.$orange-palette`

## 🔍 Icons

Material Icons are included. Use them with `<mat-icon>`:

```html
<mat-icon>home</mat-icon>
<mat-icon>favorite</mat-icon>
<mat-icon>settings</mat-icon>
```

Browse all icons at: https://fonts.google.com/icons

## 📖 Additional Resources

- **Material Components**: https://material.angular.dev/components
- **CDK Documentation**: https://material.angular.dev/cdk
- **Theming Guide**: https://material.angular.dev/guide/theming
- **Component Examples**: https://material.angular.dev/components/categories

## 💡 Tips

1. **Import only what you need**: Each Material module should be imported where it's used
2. **Use Material Icons**: Over 2,000 icons available for free
3. **Responsive Design**: Material components are responsive by default
4. **Accessibility**: Material components follow WCAG guidelines
5. **Performance**: Tree-shaking removes unused Material code in production builds

## 🚀 Next Steps for Your Blog Platform

Consider using these Material components for your blog:

- **MatToolbar**: Header navigation
- **MatCard**: Blog post cards
- **MatFormField + MatInput**: Comment forms, search bars
- **MatButton**: Call-to-action buttons
- **MatChips**: Post tags/categories
- **MatPaginator**: Blog post pagination
- **MatDialog**: Image galleries, confirmations
- **MatSnackBar**: Success/error notifications
- **MatMenu**: User profile menu
- **MatSidenav**: Mobile navigation drawer

