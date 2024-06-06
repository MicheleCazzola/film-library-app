import Films from "./Films";
import { useParams } from "react-router-dom";

function MainContent(props) {

    let selectedFilter = useParams();
    
    let filterName = Object.entries(props.urlDict).find(e => e[1] === `filter/${selectedFilter.filterId}`);
    filterName = filterName ? filterName[0] : "All";

    return(
        <>  
            <Films filter={filterName} />
        </>
    );
}

export default MainContent;