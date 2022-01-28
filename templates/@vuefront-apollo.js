import 'isomorphic-fetch'
import ApolloClient from "apollo-boost";
import {map} from 'lodash'

const baseURL = typeof document !== "undefined"
? '<%= options.browserBaseURL %>'
: '<%= options.baseURL %>'
export default (ctx, inject) => {
  const client = new ApolloClient({
    uri: baseURL,
      headers: {
        accept: 'application/json; charset=UTF-8',
        'content-type': 'application/json; charset=UTF-8'
      },
      onError: (error) => {
        console.log(JSON.stringify(error));
        if (error.graphQLErrors) {
          console.log('ApolloClient graphQLErrors')
          console.log(error)
        }
        if (error.networkError) {
          console.log('ApolloClient networkError')
          console.log(error)
        }
      },
      request: (operation) => {
        operation.setContext({
          fetchOptions: {
            credentials: 'include'
          }
        });

        const headers = {}

        if (
          ctx.$store.getters['common/customer/token']
        ) {
          headers['Authorization'] = 'Bearer ' + ctx.$store.getters['common/customer/token']
        }

        headers['Cookie'] = map(
          ctx.$cookies.getAll(),
          (value, index) => {
            let resValue = value
            if(typeof value === 'object') {
              resValue = JSON.stringify(resValue)
            }
            if (typeof value === 'array') {
              resValue = JSON.stringify(resValue)
            }
            return index + '=' + resValue
          }
        ).join(';')

        operation.setContext({
          headers
        });
      }
    });
    
  inject('vfapollo', client)
}