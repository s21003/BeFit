import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import GuestPage from "./pages/user/GuestPage";
// import SettingsPage from "./pages/SettingsPage";
import AllExercisesPage from "./pages/exercise/AllExercisesPage";
import DetailsExercisePage from "./pages/exercise/DetailsExercisePage";
import AddExercisePage from "./pages/exercise/AddExercisePage";
import AddMealPage from "./pages/meal/AddMealPage";
import AddMealSchemaPage from "./pages/meal/AddMealSchemaPage";
import AllMealSchemasPage from "./pages/meal/AllMealSchemasPage";
import AllMealsPage from "./pages/meal/AllMealsPage";
import DetailsMealPage from "./pages/meal/DetailsMealPage";
import DetailsMealSchemaPage from "./pages/meal/DetailsMealSchemaPage";
import AddProductPage from "./pages/product/AddProductPage";
import AllProductsPage from "./pages/product/AllProductsPage";
import DetailsProductPage from "./pages/product/DetailsProductPage";
import AllTrainersPage from "./pages/trainer/AllTrainersPage";
import AddTrainerPage from "./pages/trainer/AddTrainerPage";
import DetailsTrainerPage from "./pages/trainer/DeatilsTrainerPage";
import AddTrainingPage from "./pages/trainings/AddTrainingPage";
import AllTrainingsPage from "./pages/trainings/AllTrainingsPage";
import DetailsTrainingPage from "./pages/trainings/DetailsTrainingPage";
import AddTrainingSchemaPage from "./pages/trainings/AddTrainingSchemaPage";
import AllTrainingSchemasPage from "./pages/trainings/AllTrainingSchemasPage";
import DetailsTrainingSchemaPage from "./pages/trainings/DetailsTrainingSchemaPage";
// import AllUsersPage from "./pages/user/AllUsersPage";
import GoalsPage from "./pages/user/GoalsPage";
// import LogoutPage from "./pages/user/LogoutPage";
// import UsersTrainersPage from "./pages/user/UsersTrainersPage";
import {UserProvider} from "./helpers/UserContext";
import OwnProductsPage from "./pages/product/OwnProductsPage";
import Chat from "./pages/chat/Chat";
import TmpChatPage from "./pages/chat/TmpChatPage"


function App() {
  return (
      <UserProvider>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            {/*<Route path="/guest" element={<GuestPage/>}/>*/}
            {/*<Route path="/logout" element={<LogoutPage/>}/>*/}
            {/*<Route path="/settings" element={<SettingsPage/>}/>*/}
            <Route path="/all-exercises" element={<AllExercisesPage/>}/>
            <Route path="/exercise/:id" element={<DetailsExercisePage/>}/>
            <Route path="/add-exercise" element={<AddExercisePage/>}/>
            <Route path="/add-meal" element={<AddMealPage/>}/>
            <Route path="/add-meal-schema" element={<AddMealSchemaPage/>}/>
            <Route path="/all-meals" element={<AllMealsPage/>}/>
            <Route path="/all-meal-schemas" element={<AllMealSchemasPage/>}/>
            <Route path="/meal/:id" element={<DetailsMealPage/>}/>
            <Route path="/meal-schema/:id" element={<DetailsMealSchemaPage/>}/>
            <Route path="/add-product" element={<AddProductPage/>}/>
            <Route path="/all-products" element={<AllProductsPage />}/>
            <Route path="/product/:id" element={<DetailsProductPage/>}/>
            <Route path="/own-products" element={<OwnProductsPage/>}/>
            <Route path="/all-trainers" element={<AllTrainersPage/>}/>
            <Route path="/add-trainer" element={<AddTrainerPage/>}/>
            <Route path="/trainer/:id" element={<DetailsTrainerPage/>}/>
            <Route path="/add-training" element={<AddTrainingPage/>}/>
            <Route path="/add-training-schema" element={<AddTrainingSchemaPage/>}/>
            <Route path="/all-trainings" element={<AllTrainingsPage/>}/>
            <Route path="/all-training-schemas" element={<AllTrainingSchemasPage/>}/>
            <Route path="/training/:id" element={<DetailsTrainingPage/>}/>
            <Route path="/training-schema/:id" element={<DetailsTrainingSchemaPage/>}/>
            <Route path="/chat" element={<Chat/>}/>
            {/*<Route path="/users-trainers" element={<UsersTrainersPage/>}/>*/}
            <Route path="/goals" element={<GoalsPage/>}/>
            {/*<Route path="/all-users" element={<AllUsersPage/>}/>*/}
            <Route path="/tmpChat" element={<TmpChatPage/>}/>
        </Routes>
      </Router>
      </UserProvider>
  );
}

export default App;
