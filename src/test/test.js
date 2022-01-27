import axios from 'axios'

export function test () {
    let name = ''
    let url = ''
    let decode404 = false;
    // const http = axios.create({
    //     baseURL: url
    // })

    const invoke = (rests) => {
      Object.entries(rests).map(e => {
          let value = "asdf"
        this[e[0]] = new Function(e[1].params.map(p => (p.replace('path-', 'path_').replace('param-', 'param_'))), 'console.log(value)')
      })
    }
    invoke({
        getUser: {
            uri: '/rest/api/space/{key}/content',
            mothod: "GET",
            produces: "applcation/json",
            headers: ['content-type=application/json;charset=utf-8'],
            params: ['path-key', 'param-expand'],
        }
    })
}