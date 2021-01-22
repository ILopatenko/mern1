import axios from 'axios';
import { setAlert } from './alert';
import { CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED } from './types';

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Get profile of current user
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CREATE or UPDATE a profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile UPDATED' : 'Profile CREATED', 'success'));

        if (!edit) {
            history.push('/dashboard');
        };

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        };
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//ADD experience
export const addExperience = (formData, history,) => async dispatch => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('EXPERIENCE ADDED', 'success'));
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        };
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//ADD EDUCATION
export const addEducation = (formData, history) => async dispatch => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('EDUCATION ADDED', 'success'));
        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        };
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//DELETE EXPERIENCE
export const deleteExperience = id => async dispatch => {
    try {

        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('EXPERIENCE removed', 'success'));

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        };
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//DELETE EDUCATION
export const deleteEducation = id => async dispatch => {
    try {

        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('EDUCATION removed', 'success'));

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        };
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//DELETE USER AND PROFILE
export const deleteAcc = () => async dispatch => {

    if (window.confirm('Are you sure? Your account will be deleted!')) {
        try {

            const res = await axios.delete('/api/profile');

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });
            dispatch(setAlert('YOUR ACCOUNT HAS BEEN DELETED'));

        } catch (err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
            };
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    };
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++