const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTE5NmM3NDU5Y2I3MWEyZGIxYmM4NWVmODJmZWEzMWUxYzRiNTM3MjhjZTYzNTdjNWY2Nzk4NGQ2NjUxNzE5OTM1NmU0YTdiZmM0MjE4OGQiLCJpYXQiOjE3NzQ5ODIzMjcuNzY5MjI2LCJuYmYiOjE3NzQ5ODIzMjcuNzY5MjI4LCJleHAiOjE4MDY1MTgzMjcuNzU2ODY1LCJzdWIiOiJhMTZlODc3MC1kYjc0LTRiNjYtYTNhOC01MDNjYWI3ZDk0YzUiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY29tcGFuaWVzIiwiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsInNoaXBwaW5nLWNoZWNrb3V0Iiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy10cmFja2luZyIsIm9yZGVycy1yZWFkIl19.nBqXd5QPdvAK2eGjF5nI0fgri-AGMXN7LAH96tGhwQAocwx29AgrONmPt2uShNjGX70496edtR_Waj3FAwGtb1NIEup5kr4hCjR4nxfrBj5J-B3zr0cDpiEphTjK3ljthH3PT1I5v7sggIiwHe9pnqgV-wR94j-VQ0Ahp0bEJqPRPehaU67Hm9Kgf0i78De6ONxUmHcxZjrXCt8uP0u-kLFSPj2L5sbSMgqpDan3PalQLCv3VTSVVxNNcm2SPhACjmu5vtFFaOoBYOzYPxS9dAQk9KKGETWIveN45C20_n29MPfAy-cQFX-6MVEx1r_MpHkW4Q7eo3jzUaBX9p5YhdqopY7Glqp5iuH4CuPnGmQqhNn_qx-xRy9OEHRCjuxrWO9HSsoRrD_FItUk8dDPvgeUrRjzXcFLSOf7o0MyUWwuiSR1aHHJIiiweaYx6JYBO5U_F_1xqM8aBFkOT-xv5SfbQNTeeqK5gIuDmuRO7yhfVMGJ6EH8XvF96i_AmK35fjgrrKOsZM8A2grvTydoF_lsIdbwe2_NdOpl9MS7V-LfCx3NDWzvXgbQEx9E_uhdOD912yahZQyMreSsYi7xUCrRPn9FqAD8RVMvlWrgBCujZCn370FAPdI5mK8DrsuLyLAth0_5uQtFU-piWG0ZyFvj_Xkw0BrfsVHcKiPfG1Q';
const payload = {
  from: { postal_code: '01001000' },
  to: { postal_code: '20020080' },
  products: [{ id: '1', width: 11, height: 17, length: 11, weight: 0.3, insurance_value: 10.1, quantity: 1 }]
};
fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(payload)
}).then(r => r.text()).then(console.log).catch(console.error);
