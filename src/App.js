import './App.css'
import Drivers from './Context/Drivers/DriversList'
import Trucks from './Context/Trucks/TrucksList'
import Trailers from './Context/Trailers/TrailersList'
import Loads from './Context/Loads/LoadsList'
import Travels from './Context/Travels/TravelsList'
import Customers from './Context/Customers/CustomersList'
import Invoices from './Context/Invoices/InvoicesList'
import Notifications from './Components/NotifiactionsPage'
import CompanyDocuments from './Components/CompanyDocuments'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import DashboardSidebar from './Components/DashboardSidebar'
import DashboardNavbar from './Components/DashboardNavbar'
import AdminDashboard from './Components/AdminDashboard'
import CreateDriver from './Context/Drivers/CreateDriver'
import CreateTruck from './Context/Trucks/CreateTruck'
import CreateTrailer from './Context/Trailers/CreateTrailer'
import CreateLoad from './Context/Loads/CreateLoad'
import CreateTravel from './Context/Travels/CreateTravel'
import CreateCustomer from './Context/Customers/CreateCustomer'
import CreateInvoice from './Context/Invoices/CreateInvoice'
import Login from './Components/Login'
import Forbidden from './Components/Forbidden'
import Unknow from './Components/Unknow'
import { DriversProvider } from './Context/Drivers/Drivers'
import { TrucksProvider } from './Context/Trucks/Trucks'
import { TrailersProvider } from './Context/Trailers/Trailers'
import { LoadsProvider } from './Context/Loads/Loads'
import { TravelsProvider } from './Context/Travels/Travels'
import { CustomersProvider } from './Context/Customers/Customers'
import { InvoicesProvider } from './Context/Invoices/Invoices'
import { ActivitiesProvider } from './Context/Invoices/Activities'
function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <div id="wrapper">
          <Switch>
            <Route path="/403" exact component={Forbidden} />
            <Route path="/404" exact component={Unknow} />
            <Route path="/login" exact component={Login} />
            <Route>
              <DashboardSidebar />
              <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                  <DashboardNavbar />
                  <DriversProvider>
                    <TrucksProvider>
                      <TrailersProvider>
                        <LoadsProvider>
                          <TravelsProvider>
                            <CustomersProvider>
                              <InvoicesProvider>
                                <ActivitiesProvider>
                                  <Switch>
                                    <Route
                                      path="/dashboard"
                                      exact
                                      component={AdminDashboard}
                                    />
                                    <Route
                                      path="/drivers"
                                      exact
                                      component={Drivers}
                                    />
                                    <Route
                                      path="/trucks"
                                      exact
                                      component={Trucks}
                                    />
                                    <Route
                                      path="/trailers"
                                      exact
                                      component={Trailers}
                                    />
                                    <Route
                                      path="/loads"
                                      exact
                                      component={Loads}
                                    />
                                    <Route
                                      path="/travels"
                                      exact
                                      component={Travels}
                                    />
                                    <Route
                                      path="/customers"
                                      exact
                                      component={Customers}
                                    />
                                    <Route
                                      path="/invoices"
                                      exact
                                      component={Invoices}
                                    />
                                    <Route
                                      path="/documents"
                                      exact
                                      component={CompanyDocuments}
                                    />
                                    <Route
                                      path="/notifications"
                                      exact
                                      component={Notifications}
                                    />
                                    <Route
                                      path="/CreateDriver"
                                      exact
                                      component={CreateDriver}
                                    />
                                    <Route
                                      path="/CreateTruck"
                                      exact
                                      component={CreateTruck}
                                    />
                                    <Route
                                      path="/CreateTrailer"
                                      exact
                                      component={CreateTrailer}
                                    />
                                    <Route
                                      path="/CreateLoad"
                                      exact
                                      component={CreateLoad}
                                    />
                                    <Route
                                      path="/CreateTravel"
                                      exact
                                      component={CreateTravel}
                                    />
                                    <Route
                                      path="/CreateCustomer"
                                      exact
                                      component={CreateCustomer}
                                    />
                                    <Route
                                      path="/CreateInvoice"
                                      exact
                                      component={CreateInvoice}
                                    />
                                    <Route
                                      path="/editDriver/:did"
                                      exact
                                      component={CreateDriver}
                                    />
                                    <Route
                                      path="/editTruck/:tid"
                                      exact
                                      component={CreateTruck}
                                    />
                                    <Route
                                      path="/editTrailer/:tid"
                                      exact
                                      component={CreateTrailer}
                                    />
                                    <Route
                                      path="/editLoad/:lid"
                                      exact
                                      component={CreateLoad}
                                    />
                                    <Route
                                      path="/editTravel/:tid"
                                      exact
                                      component={CreateTravel}
                                    />
                                    <Route
                                      path="/editCustomer/:cid"
                                      exact
                                      component={CreateCustomer}
                                    />
                                    <Route
                                      path="/editInvoice/:iid"
                                      exact
                                      component={CreateInvoice}
                                    />
                                    <Route path="/" exact>
                                      <Redirect to="/documents" />
                                    </Route>
                                    <Route path="*" exact>
                                      <Redirect to="/404" />
                                    </Route>
                                  </Switch>
                                </ActivitiesProvider>
                              </InvoicesProvider>
                            </CustomersProvider>
                          </TravelsProvider>
                        </LoadsProvider>
                      </TrailersProvider>
                    </TrucksProvider>
                  </DriversProvider>
                </div>
                <footer className="sticky-footer bg-secondary text-white">
                  <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                      <span>
                        Designed by César Valencia & Powered by Abraham Escarrá
                        &copy; 2022
                      </span>
                    </div>
                  </div>
                </footer>
              </div>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
