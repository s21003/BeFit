import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignUpPage";
import DetailsExercisePage from "./pages/exercise/DetailsExercisePage";
import AddExercisePage from "./pages/exercise/AddExercisePage";
import AddMealPage from "./pages/meal/AddMealPage";
import AddMealSchemaPage from "./pages/meal/AddMealSchemaPage";
import AllMealSchemasPage from "./pages/meal/AllMealSchemasPage";
import AllMealsPage from "./pages/meal/AllMealsPage";
import DetailsMealPage from "./pages/meal/DetailsMealPage";
import DetailsMealSchemaPage from "./pages/meal/DetailsMealSchemaPage";
import AddProductPage from "./pages/product/AddProductPage";
import DetailsProductPage from "./pages/product/DetailsProductPage";
import AllTrainersPage from "./pages/trainer/AllTrainersPage";
import DetailsTrainerPage from "./pages/trainer/DeatilsTrainerPage";
import AddTrainingPage from "./pages/trainings/AddTrainingPage";
import AllTrainingsPage from "./pages/trainings/AllTrainingsPage";
import DetailsTrainingPage from "./pages/trainings/DetailsTrainingPage";
import AddTrainingSchemaPage from "./pages/trainings/AddTrainingSchemaPage";
import AllTrainingSchemasPage from "./pages/trainings/AllTrainingSchemasPage";
import DetailsTrainingSchemaPage from "./pages/trainings/DetailsTrainingSchemaPage";
import DetailsStudentPage from "./pages/student/DetailsStudentPage";
import StudentsMealsPage from "./pages/student/StudentsMealsPage";
import StudentsTrainingsPage from "./pages/student/StudentsTrainingsPage";
import {UserProvider} from "./helpers/UserContext";
import OwnProductsPage from "./pages/product/OwnProductsPage";
import OwnExercisesPage from "./pages/exercise/OwnExercisesPage";
import TmpChatPage from "./pages/chat/TmpChatPage"
import OwnStudentsPage from "./pages/student/OwnStudentsPage";
import ProfilePage from "./pages/user/ProfilePage";
import StudentsGoalPage from "./pages/student/StudentsGoalPage";
import AddTrainerToTrainingPage from "./pages/trainings/AddTrainerToTrainingPage";


function App() {
  return (
      <UserProvider>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/exercise/:id" element={<DetailsExercisePage/>}/>
            <Route path="/add-exercise" element={<AddExercisePage/>}/>
            <Route path="/add-meal" element={<AddMealPage/>}/>
            <Route path="/add-meal-schema" element={<AddMealSchemaPage/>}/>
            <Route path="/all-meals" element={<AllMealsPage/>}/>
            <Route path="/all-meal-schemas" element={<AllMealSchemasPage/>}/>
            <Route path="/meal/:id" element={<DetailsMealPage/>}/>
            <Route path="/meal-schema/:id" element={<DetailsMealSchemaPage/>}/>
            <Route path="/add-product" element={<AddProductPage/>}/>
            <Route path="/product/:id" element={<DetailsProductPage/>}/>
            <Route path="/all-trainers" element={<AllTrainersPage/>}/>
            <Route path="/trainer/:id" element={<DetailsTrainerPage/>}/>
            <Route path="/add-training" element={<AddTrainingPage/>}/>
            <Route path="/add-training-schema" element={<AddTrainingSchemaPage/>}/>
            <Route path="/all-trainings" element={<AllTrainingsPage/>}/>
            <Route path="/all-training-schemas" element={<AllTrainingSchemasPage/>}/>
            <Route path="/training/:id" element={<DetailsTrainingPage/>}/>
            <Route path="/training-schema/:id" element={<DetailsTrainingSchemaPage/>}/>
            <Route path="/own-products" element={<OwnProductsPage/>}/>
            <Route path="/own-exercises" element={<OwnExercisesPage/>}/>
            <Route path="/own-students" element={<OwnStudentsPage/>}/>
            <Route path="/details-student/:username" element={<DetailsStudentPage/>}/>
            <Route path="/students-meals/:studentUserName" element={<StudentsMealsPage/>}/>
            <Route path="/students-trainings/:studentUserName" element={<StudentsTrainingsPage/>}/>
            <Route path="/students-goals/:studentUserName" element={<StudentsGoalPage/>}/>
            <Route path="/tmpChat" element={<TmpChatPage/>}/>
            <Route path="/add-trainer-to-training/:trainingId" element={<AddTrainerToTrainingPage/>}/>
        </Routes>
      </Router>
      </UserProvider>
  );
}

export default App;
