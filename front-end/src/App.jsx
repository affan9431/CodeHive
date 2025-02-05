import "./App.css";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Import the devtools
import { Toaster } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Security from "./pages/Security";
import CourseDetails from "./pages/CourseDetails";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import StartBuisness from "./pages/StartBuisness";
import CourseCreation from "./pages/CourseCreation";
import ZoomMeets from "./pages/ZoomMeets";
import ProtectRoute from "./protected/ProtectRoute";
import CreateCourse from "./component/CreateCourse";
import MyCourses from "./component/MyCourses";
import Performance from "./component/Performance";
import InstructorCourseManage from "./pages/InstructorCourseManage";
import IntendedLearner from "./pages/IntendedLearner";
import CurriculumBuilder from "./pages/CurriculumBuilder";
import Caption from "./pages/Caption";
import CourseLanding from "./pages/CourseLanding";
import Pricing from "./pages/Pricing";
import { CourseDataProvider } from "./context/CourseContext";
import Profile from "./pages/Profile";
import CourseReview from "./component/CourseReview";
import CourseReviewDetail from "./component/CourseReviewDetail";
import LiveTuting from "./component/LiveTuting";
import LectureAccess from "./pages/LectureAccess";
import AvailableCourse from "./pages/AvailableCourse";
import SearchResult from "./pages/SearchResult";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
function App() {
  const { t } = useTranslation();

  return (
    <CourseDataProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate replace to="/app/home" />} />{" "}
            {/* Redirect root to /app/home */}
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route path="home" element={<Home />} />
              <Route path="security" element={<Security />} />
              <Route path="search/:name" element={<SearchResult />} />
              <Route path="courseDetail/:id" element={<CourseDetails />} />
              <Route
                path=":title/:id/learn/lecture/success"
                element={<LectureAccess />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="my-courses/learning" element={<AvailableCourse />} />
              <Route path="startBuisness" element={<ProtectRoute />}>
                <Route index element={<StartBuisness />} />
              </Route>
              <Route path="live-tuting" element={<ZoomMeets />} />
            </Route>
            <Route path="instructor" element={<CourseCreation />}>
              <Route index element={<Navigate replace to="create-course" />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route
                path="my-courses/manage/:title/:id"
                element={<InstructorCourseManage />}
              >
                <Route
                  index
                  element={<Navigate replace to="intended-learners" />}
                />
                <Route path="intended-learners" element={<IntendedLearner />} />
                <Route path="curriculum" element={<CurriculumBuilder />} />
                <Route path="captions" element={<Caption />} />
                <Route path="course-landing-page" element={<CourseLanding />} />
                <Route path="pricing" element={<Pricing />} />
              </Route>
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="performance" element={<Performance />} />
              <Route path="course-review" element={<CourseReview />} />
              <Route path="live-tuting" element={<LiveTuting />} />
              <Route
                path="course-review/review"
                element={<CourseReviewDetail />}
              />
            </Route>
            <Route path="login" element={<SignIn />} />
            <Route path="createAccount" element={<Signup />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "black",
              color: "white",
            },
          }}
        />
      </QueryClientProvider>
    </CourseDataProvider>
  );
}

export default App; // Corrected this line
