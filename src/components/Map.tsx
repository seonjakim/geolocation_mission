import axios from "axios"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserInfo, setAddressList } from "../../redux/maps"
import { RootState } from "../../redux/store"

declare global {
  interface Window {
    kakao: any
  }
}
type MapProps = {
  setIsMapOpen: Dispatch<SetStateAction<boolean>>
}

const marker = new window.kakao.maps.Marker()
const infowindow = new window.kakao.maps.InfoWindow({ zindex: 1 })
const Map = ({ setIsMapOpen }: MapProps) => {
  const { addressList } = useSelector((state: RootState) => state.maps)
  const dispatch = useDispatch()
  const [address, setAddress] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const { kakao } = window
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<any>()

  const geocoder = new kakao.maps.services.Geocoder()
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  }
  const searchDetailAddrFromCoords = (coords, callback) => {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback)
  }

  const showDetailAddrFromCoords = (result, event) => {
    let coords = new kakao.maps.LatLng(result[0].y, result[0].x)
    if (event) coords = event.latLng
    marker.setPosition(coords)
    marker.setMap(map.current)
    let detailAddr = !!result[0].road_address
      ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>"
      : ""
    detailAddr +=
      "<div>지번 주소 : " + result[0].address.address_name + "</div>"

    let content = `<div class="bAddr">
                    <span class="title">법정동 주소정보</span> ${detailAddr}
                    <button id='infowindow-button'>이 주소로 배송할래요!</button>
                  </div>`
    infowindow.setContent(content)
    infowindow.open(map.current, marker)
    const infowindowButton = document.getElementById("infowindow-button")
    infowindowButton?.addEventListener("click", () => {
      dispatch(setUserInfo({ address: result[0].address.address_name }))
      setIsMapOpen(false)
    })
    map.current.setCenter(coords)
  }
  const request = async () => {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/address.json",
      {
        params: { query: address },

        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_REST_API_KEY}`,
        },
      }
    )
    if (response.status === 200) {
      dispatch(setAddressList(response.data.documents))
    }
  }
  useEffect(() => {
    geocoder.addressSearch(selectedAddress, (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        showDetailAddrFromCoords(res, null)
      }
    })
  }, [selectedAddress])
  useEffect(() => {
    request()
  }, [address])
  useEffect(() => {
    map.current = new kakao.maps.Map(container.current, options)
    geocoder.addressSearch("전북 삼성동 100", (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        showDetailAddrFromCoords(res, null)
      }
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude
        let lng = position.coords.longitude
        let locPosition = new kakao.maps.LatLng(lat, lng)
        marker.setPosition(locPosition)
        marker.setMap(map.current)
        infowindow.setContent(`<div class='bAddr'>지금 여기 계신가요?</div>`)
        infowindow.open(map.current, marker)
        map.current.setCenter(locPosition)
      })
    }
    kakao.maps.event.addListener(map.current, "click", function (mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          showDetailAddrFromCoords(result, mouseEvent)
        }
      })
    })
  }, [])

  return (
    <div className="map-container">
      <div>
        <input type="text" onChange={(e) => setAddress(e.target.value)} />
        <ul>
          {addressList.map((address, index) => (
            <li
              onClick={() => setSelectedAddress(address.address.address_name)}
              key={index}
            >
              {address.address.address_name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ height: "100%" }} ref={container} id="map"></div>
    </div>
  )
}

export default Map
