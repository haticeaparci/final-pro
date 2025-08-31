import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const emptyConfig = {};
const emptyArray = [];

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("/api/meals", emptyConfig, emptyArray);
  console.log(loadedMeals, isLoading, error);
  if (isLoading) return <p className="center">Fetching meals...</p>;
  if (error) return <Error title="Failed to fetch meals" message={error} />;

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
