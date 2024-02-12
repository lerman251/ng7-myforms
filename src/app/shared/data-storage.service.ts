import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap, throwError } from "rxjs";
import { AuthSevice } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })

export class DataStorageService {
    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthSevice
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://ng-access-backend-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
            console.log(response);
        });
    }
    
    fetchRecipes() {
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                if (user === null) {
                    // Handle the case where user is null.
                    // Maybe return an Observable that emits an error.
                    return throwError('User is null');
                }

                return this.http.get<Recipe[]>(
                    'https://ng-access-backend-default-rtdb.firebaseio.com/recipes.json',
                    {
                        params: new HttpParams().set('auth', user.token ?? '')
                    }
                );
            }),  
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, 
                        ingredients: recipe.ingredients ?   recipe.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}