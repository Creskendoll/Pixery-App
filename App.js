import { createStackNavigator, createAppContainer } from 'react-navigation';
import MyCamera from "./MyCamera";
import ShopScreen from "./ShopScreen";

const MainNavigator = createStackNavigator(
  {
    Home: { screen: MyCamera },
    
    Shop: { screen: ShopScreen }
  });

const App = createAppContainer(MainNavigator);

export default App;