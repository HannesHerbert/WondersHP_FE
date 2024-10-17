



function MemberRow({member}) {


    // const memberObj = {
    //     firstname: ,
    //     lastname: ,
    //     instrument: ,
    //     description: ,
    //     image_path: ,
    //     image_position: 
    // }



    return (
        <div className="member-row">

                <div className="member-image">
                    <img src={member.image} alt="" />
                </div>

                <div className="member-informations">

                    <div className="member-name">

                        <label htmlFor="firstname">Vorname:</label>
                        <input type="text" name="firstname" />

                        <label htmlFor="lastname">Nachname:</label>
                        <input type="text" name="lastname" />

                        <label htmlFor="instrument">Instrument:</label>
                        <input type="text" name="instrument" />

                        <label htmlFor="image-position">Bildposition:</label>
                        <select name="image-position" id="">

                        </select>

                    </div>

                    <div className="member-description">
                        <textarea></textarea>
                    </div>

                </div>
            </div>
    )
}

export default MemberRow