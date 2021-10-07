import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FavoriteButton, CarrouselRecomendations,
  ShareButton, Loading, StartRecipe } from '../components';
import HeaderRecipes from '../components/ComponentsRefeições/HeaderRecipes';
import Ingredients from '../components/ComponentsRefeições/Ingredients';
import Instruction from '../components/ComponentsRefeições/Instruction';
import Video from '../components/ComponentsRefeições/Video';
import Context from '../contextAPI/Context';

function FoodDetails(props) {
  const { match: { params: { id } }, location, history } = props;
  const [recomendation, setRecomendation] = useState([{}]);
  const [item, setItem] = useState([]);
  const { recipeInProgress } = useContext(Context);

  const fetchById = async (idLocation) => {
    const response = (await (await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idLocation}`)).json()).meals;
    setItem(response);
  };

  const fetchFoodOrDrinkRecomendations = async () => {
    const response = (await (await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')).json()).drinks;
    setRecomendation(response);
  };

  useEffect(() => {
    const fetchAndSet = async () => {
      await fetchById(id);
      await fetchFoodOrDrinkRecomendations();
    };
    fetchAndSet();

    if (localStorage
      .getItem('favoriteRecipes') === null) localStorage.setItem('favoriteRecipes', '[]');
    if (localStorage
      .getItem('inProgressRecipes') === null) {
      localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
    }
  }, [id, recipeInProgress]);

  if (item.length === 0 || item === null) return (<Loading />);
  const { strMeal, strMealThumb, strCategory, strInstructions, strYoutube } = item[0];

  return (
    <div>
      <HeaderRecipes
        title={ strMeal }
        img={ strMealThumb }
        subtitle={ strCategory }
      />
      <div className="options" style={ { display: 'flex' } }>
        <FavoriteButton item={ item } history={ history } />
        <ShareButton location={ location } />
      </div>
      <Ingredients item={ item } dataTestId="ingredient-name-and-measure" />
      <div className="instructions">
        <Instruction strInstructions={ strInstructions } />
      </div>
      <div className="video">
        <Video strYoutube={ strYoutube } />
      </div>
      <h3>Recomendadas</h3>
      <CarrouselRecomendations recomendation={ recomendation } drink />
      <StartRecipe id={ id } history={ history } />
    </div>
  );
}

FoodDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default FoodDetails;
