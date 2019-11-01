import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HomePage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import NotFound from '@/components/NotFound'
import ProfileBuilder from '@/components/ProfileBuilder'
import Profile from '@/components/Profile'

import axios from 'axios'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/oauth/:id/:token',
      name: 'OAuth',
      beforeEnter (to, from, next) {
        console.log(to.params)
        axios.post(`http://localhost:3000/api/auth/login/`, {username: to.params.id, token: to.params.token})
          .then(response => {
            localStorage.setItem('jwtToken', response.data.token)
            localStorage.setItem('user_first_time', response.data.user.first_time)
            localStorage.setItem('user_id', response.data.user._id)
            localStorage.setItem('role', response.data.user.role)

            if (response.data.user.first_time) {
              next({
                name: 'ProfileBuilder'
              })
            } else {
              next({
                name: 'HomePage'
              })
            }
          })
      }


    },
    {
      path: '/',
      name: 'HomePage',
      component: Home,
      beforeEnter (to, from, next) {
        console.log(localStorage)
        if (localStorage.getItem('jwtToken')) {
          if (localStorage.getItem('user_first_time') === 'true') {
            next({name: 'ProfileBuilder'})
          } else {
            next()
          }
        } else {
          next({
            name: 'Login'
          })
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('jwtToken')) {
          next({path: from.path})
        } else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/build_profile',
      name: 'ProfileBuilder',
      component: ProfileBuilder,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('user_first_time') === 'true') {
          if (localStorage.getItem('jwtToken')) {
            next()
          }
        } else {
          if (localStorage.getItem('jwtToken')) {
            next({name: 'HomePage'})
          } else {
            next({name: 'Login'})
          }
        }
      }

    }
  ]
})
