import "../../styles/components/general/PageUnderConstruction.css"
import BackButton from "../layout/BackButton"

const PageUnderConstruction = () => {
  return (
    <>
      <BackButton/>
      <section className="under-construction center">
        <h3 className="main-message">Sorry! Page under construction</h3>
      </section>
    </>

  )
}

export default PageUnderConstruction;