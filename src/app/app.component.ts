import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { JsonPipe } from '@angular/common';

interface Pokemon {
  value: string;
  viewValue: string;
}

interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    JsonPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  toppings = new FormControl<string[] | undefined>([]);
  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];
  @ViewChild('selectAll') selectAll: MatOption | undefined;
  @ViewChild('selectAllPokemon') selectAllPokemon: MatOption | undefined;

  pokemonControl = new FormControl<string[] | undefined>([]);
  pokemonGroups: PokemonGroup[] = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];

  get enabledPokemons(): string[] | null | undefined {
    return this.pokemonGroups
      .filter((p) => !p.disabled)
      .map((p) => p.pokemon)
      .flat()
      .map((p) => p.value);
  }

  constructor() {
    this.toppings.valueChanges.subscribe((v) => {
      this.toppings.setValue(
        v?.filter((v) => v !== 'select-all'),
        { emitEvent: false, emitModelToViewChange: false }
      );
    });
    this.pokemonControl.valueChanges.subscribe((v) => {
      this.pokemonControl.setValue(
        v?.filter((v) => v !== 'select-all'),
        { emitEvent: false, emitModelToViewChange: false }
      );
      if (this.pokemonControl.value?.length === this.enabledPokemons?.length) {
        this.selectAllPokemon?.select(false);
      } else if (this.selectAllPokemon?.selected) {
        this.selectAllPokemon?.deselect(false);
      }
    });
  }

  toggleAll(ev: MatOptionSelectionChange) {
    if (ev.isUserInput) {
      if (ev.source.selected) {
        this.toppings.setValue(this.toppingList);
      } else {
        this.toppings.setValue([]);
      }
    }
  }

  toggleOption(ev: MatOptionSelectionChange) {
    if (ev.isUserInput) {
      if (!ev.source.selected) {
        if (this.selectAll && this.selectAll.selected) {
          this.selectAll.deselect(false);
        }
      } else {
        if (this.toppings.value?.length === this.toppingList.length - 1) {
          this.selectAll?.select(false);
        }
      }
    }
  }

  toggleAllPokemon(ev: MatOptionSelectionChange) {
    if (ev.isUserInput) {
      if (ev.source.selected) {
        this.pokemonControl.setValue(this.enabledPokemons);
      } else {
        this.pokemonControl.setValue([]);
      }
    }
  }
}
