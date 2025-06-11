import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';

import {
  CHAT_MOBILE_PAGE,
  CHAT_PAGE,
  CREATE_PROFILE_PAGE,
  DOCTOR_PAGE,
  DOCUMENTS_PAGE,
  GLOBAL_LAYOUT,
  NOT_FOUND_PAGE,
  OUR_DOCTORS_PAGE,
  PERSONAL_DATA_AGREEMENT_PAGE,
  POLICY_PERSONAL_DATA_PAGE,
  REGISTRATION_PAGE,
  SETTINGS_MOBILE_PAGE,
  USER_AGREEMENT_PAGE,
  USER_CHAT,
  VERIFICATION_PAGE,
} from './constant/url-page.constants';
import GlobalLayoutPage from './pages/chat/chat-layout/GlobalLayoutPage';
import DoctorPage from './pages/doctor-page/DoctorPage';
import NotFoundPage from './pages/not-found/NotFoundPage';
import Test from './Test';
import RootBoundaryComponent from './ui/error-component/RootBoundaryComponent';
import RootBoundaryPage from './ui/error-component/RootBoundaryPage';
import GlobalLoading from './ui/suspense-loading/GlobalLoading';
import OutletLoading from './ui/suspense-loading/OutletLoading';

const SettingsMobilePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SettingsMobilePage" */ './pages/settings-mobile-page/SettingsMobilePage'
    )
);
const VerificationPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VerificationPage" */ './pages/verification-page/VerificationPage'
    )
);
const RegistrationPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "RegistrationPage" */ './pages/registration-page/RegistrationPage'
    )
);
const OurDoctors = React.lazy(
  () =>
    import(
      /* webpackChunkName: "OurDoctors" */ './pages/our-doctors/OurDoctors'
    )
);
const ChatPageWeb = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ChatPageWeb" */ './pages/chat/chat-page-web/ChatPageWeb'
    )
);
const ChatPageMobile = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ChatPageMobile" */ './pages/chat/chat-page-mobile/ChatPageMobile'
    )
);
const CreateProfilePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateProfilePage" */ './pages/create-profile-page/CreateProfilePage'
    )
);
const UserSelectChat = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UserSelectChat" */ './pages/chat/select-user-chat-page/SelectUserChatPage'
    )
);
const DocumentsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "DocumentsPage" */ './pages/documents-page/DocumentsPage'
    )
);
const PersonalDataAgreement = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PersonalDataAgreement" */ './pages/documents-page/PersonalDataAgreement'
    )
);
const PolicyPersonalData = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PolicyPersonalData" */ './pages/documents-page/PolicyPersonalData'
    )
);
const UserAgreement = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UserAgreement" */ './pages/documents-page/UserAgreement'
    )
);
// export const route = () =>
//   createBrowserRouter([
//     {
//       element: <Suspense fallback={<GlobalLoading />}></Suspense>,
//       errorElement: <RootBoundaryPage />,
//       children: [
//         {
//           path: GLOBAL_LAYOUT,
//           element: (
//             <Suspense fallback={<GlobalLoading />}>
//               <GlobalLayoutPage />
//             </Suspense>
//           ),
//           errorElement: <RootBoundaryPage />,
//           children: [
//             {
//               path: REGISTRATION_PAGE,
//               element: (
//                 <Suspense fallback={<GlobalLoading />}>
//                   <RegistrationPage />
//                 </Suspense>
//               ),
//               errorElement: <RootBoundaryPage />,
//             },
//             // {
//             //   path: VERIFICATION_PAGE,
//             //   element: (
//             //     <Suspense fallback={<GlobalLoading />}>
//             //       <VerificationPage />
//             //     </Suspense>
//             //   ),
//             //   errorElement: <RootBoundaryPage />,
//             // },
//             // {
//             //   path: CHAT_PAGE,
//             //   element: (
//             //     <Suspense fallback={<OutletLoading />}>
//             //       <ChatPageWeb />
//             //     </Suspense>
//             //   ),
//             //   errorElement: <RootBoundaryPage />,
//             //   children: [
//             //     {
//             //       path: USER_CHAT,
//             //       element: (
//             //         <Suspense fallback={<OutletLoading />}>
//             //           <UserSelectChat />
//             //         </Suspense>
//             //       ),
//             //       errorElement: <RootBoundaryComponent />,
//             //     },
//             //   ],
//             // },
//             // {
//             //   path: OUR_DOCTORS_PAGE,
//             //   element: (
//             //     <Suspense fallback={<OutletLoading />}>
//             //       <OurDoctors />
//             //     </Suspense>
//             //   ),
//             //   errorElement: <RootBoundaryPage />,
//             //   children: [
//             //     {
//             //       path: DOCTOR_PAGE,
//             //       element: (
//             //         <Suspense fallback={<OutletLoading />}>
//             //           <DoctorPage />
//             //         </Suspense>
//             //       ),
//             //       errorElement: <RootBoundaryComponent />,
//             //     },
//             //   ],
//             // },
//           ],
//         },
//       ],
//     },
//   ]);

const App = () => {
  console.log('APP');
  return (
    <>
      <Routes>
        {/* desk\table версия сайта */}
        <Route
          path={GLOBAL_LAYOUT}
          errorElement={<RootBoundaryPage />}
          element={
            <Suspense fallback={<GlobalLoading />}>
              <GlobalLayoutPage />
            </Suspense>
          }
        >
          <Route
            path={REGISTRATION_PAGE}
            errorElement={<RootBoundaryPage />}
            element={
              <Suspense fallback={<GlobalLoading />}>
                <RegistrationPage />
              </Suspense>
            }
          />

          <Route
            path={OUR_DOCTORS_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <OurDoctors />
              </Suspense>
            }
          >
            <Route
              path={DOCTOR_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <DoctorPage />
                </Suspense>
              }
            />
          </Route>

          <Route
            path={DOCUMENTS_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <DocumentsPage />
              </Suspense>
            }
          >
            <Route
              path={PERSONAL_DATA_AGREEMENT_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <PersonalDataAgreement />
                </Suspense>
              }
            />
            <Route
              path={USER_AGREEMENT_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <UserAgreement />
                </Suspense>
              }
            />
            <Route
              path={POLICY_PERSONAL_DATA_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <PolicyPersonalData />
                </Suspense>
              }
            />
          </Route>

          <Route
            path={VERIFICATION_PAGE}
            errorElement={<RootBoundaryPage />}
            element={
              <Suspense fallback={<GlobalLoading />}>
                <VerificationPage />
              </Suspense>
            }
          />

          <Route
            path={CHAT_PAGE}
            errorElement={<RootBoundaryPage />}
            element={
              <Suspense fallback={<OutletLoading />}>
                <ChatPageWeb />
              </Suspense>
            }
          >
            <Route
              path={USER_CHAT}
              errorElement={<RootBoundaryComponent />}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <UserSelectChat />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Мобильная версия сайта */}
        <Route
          path={CHAT_MOBILE_PAGE}
          errorElement={<RootBoundaryPage />}
          element={
            <Suspense fallback={<OutletLoading />}>
              <ChatPageMobile />
            </Suspense>
          }
        >
          <Route
            path={USER_CHAT}
            errorElement={<RootBoundaryComponent />}
            element={
              <Suspense fallback={<OutletLoading />}>
                <UserSelectChat />
              </Suspense>
            }
          />
          <Route
            path={OUR_DOCTORS_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <OurDoctors />
              </Suspense>
            }
          />
          <Route
            path={DOCUMENTS_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <DocumentsPage />
              </Suspense>
            }
          >
            <Route
              path={PERSONAL_DATA_AGREEMENT_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <PersonalDataAgreement />
                </Suspense>
              }
            />
            <Route
              path={USER_AGREEMENT_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <UserAgreement />
                </Suspense>
              }
            />
            <Route
              path={POLICY_PERSONAL_DATA_PAGE}
              element={
                <Suspense fallback={<OutletLoading />}>
                  <PolicyPersonalData />
                </Suspense>
              }
            />
          </Route>
          <Route
            path={SETTINGS_MOBILE_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <SettingsMobilePage />
              </Suspense>
            }
          />
          <Route
            path={REGISTRATION_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <RegistrationPage />
              </Suspense>
            }
          />
          <Route
            path={CREATE_PROFILE_PAGE}
            element={
              <Suspense fallback={<OutletLoading />}>
                <CreateProfilePage />
              </Suspense>
            }
          />
          <Route
            path={VERIFICATION_PAGE}
            errorElement={<RootBoundaryPage />}
            element={
              <Suspense fallback={<GlobalLoading />}>
                <VerificationPage />
              </Suspense>
            }
          />
        </Route>

        {/* страница редактирования профиля */}
        <Route
          path={CREATE_PROFILE_PAGE}
          errorElement={<RootBoundaryPage />}
          element={
            <Suspense fallback={<GlobalLoading />}>
              <CreateProfilePage />
            </Suspense>
          }
        />

        {/* страницу not found */}
        <Route
          path={NOT_FOUND_PAGE}
          element={
            <Suspense fallback={<GlobalLoading />}>
              <NotFoundPage global />
            </Suspense>
          }
        />
        <Route path="/testui" element={<Test />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
