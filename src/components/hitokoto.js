// TODO: ...
const getHitokoto = () => {
  fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch(console.error)
}
export default getHitokoto
