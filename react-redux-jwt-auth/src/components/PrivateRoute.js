import React from "react"
import { connect } from "react-redux"
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {isLoggedIn} = { ...rest }
    return (
        <Route
            {...rest}
            render={(props) => (
                isLoggedIn ?
                    <Component {...props} />
                    :
                    <Redirect to="/login" />
            )}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}
export default connect(mapStateToProps, null)(PrivateRoute)