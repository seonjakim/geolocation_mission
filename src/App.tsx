import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserInfo, getUserInfoFromLocalstorage } from "../redux/maps"
import { RootState } from "../redux/store"
import Map from "./components/Map"

function App() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: RootState) => state.maps)
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)
  const [isStoredUserInfo, setIsStoredUserInfo] = useState<{
    [key: string]: boolean
  }>({
    nickName: false,
    address: false,
    addressDetail: false,
    deliveryMessage: false,
  })
  const setLocalStorage = () => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    alert("배송 관련 정보가 저장되었습니다.")
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(setUserInfo({ [name]: value }))
  }
  const enableInputChange = (property: string) => {
    setIsStoredUserInfo((state) => ({ ...state, [property]: false }))
  }
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const storedUserInfo = JSON.parse(userInfo)
      dispatch(getUserInfoFromLocalstorage(storedUserInfo))
      for (const detail in storedUserInfo) {
        isStoredUserInfo[detail] = storedUserInfo[detail].length > 0
      }
      setIsStoredUserInfo(isStoredUserInfo)
    }
  }, [])
  return (
    <div className="user-info-container">
      <input
        onChange={handleInputChange}
        placeholder="주소의 별칭을 정해주세요."
        type="text"
        name="nickName"
        disabled={isStoredUserInfo.nickName}
        defaultValue={userInfo.nickName}
      />
      {isStoredUserInfo.nickName && (
        <img
          onClick={() => enableInputChange("nickName")}
          src="https://images.velog.io/images/seonja/post/dfc66b52-25ef-49c6-af1f-e9f78759c0a7/image.png"
          alt="edit"
        />
      )}
      <br />
      <input
        placeholder="주소"
        onClick={() => setIsMapOpen(true)}
        disabled={isStoredUserInfo.address}
        defaultValue={userInfo.address}
        type="text"
        name="address"
      />
      {isStoredUserInfo.address && (
        <img
          onClick={() => enableInputChange("address")}
          src="https://images.velog.io/images/seonja/post/dfc66b52-25ef-49c6-af1f-e9f78759c0a7/image.png"
          alt="edit"
        />
      )}

      <br />
      <input
        onChange={handleInputChange}
        placeholder="상세주소"
        type="text"
        name="addressDetail"
        disabled={isStoredUserInfo.addressDetail}
        defaultValue={userInfo.addressDetail}
      />
      {isStoredUserInfo.addressDetail && (
        <img
          onClick={() => enableInputChange("addressDetail")}
          src="https://images.velog.io/images/seonja/post/dfc66b52-25ef-49c6-af1f-e9f78759c0a7/image.png"
          alt="edit"
        />
      )}

      <br />
      <input
        onChange={handleInputChange}
        placeholder="배송시 유의사항"
        type="text"
        name="deliveryMessage"
        disabled={isStoredUserInfo.deliveryMessage}
        defaultValue={userInfo.deliveryMessage}
      />
      {isStoredUserInfo.deliveryMessage && (
        <img
          onClick={() => enableInputChange("deliveryMessage")}
          src="https://images.velog.io/images/seonja/post/dfc66b52-25ef-49c6-af1f-e9f78759c0a7/image.png"
          alt="edit"
        />
      )}

      <br />
      <button className="save-button" onClick={setLocalStorage}>
        저장
      </button>
      {isMapOpen && <Map setIsMapOpen={setIsMapOpen} />}
    </div>
  )
}

export default App
