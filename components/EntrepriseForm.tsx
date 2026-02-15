import React from 'react';

const EntrepriseForm = () => {
    // Other code...
    // Updating default values
    const defaultValues = {
        denomination: "RUSH SCHOOL",
        uai: "0932731W",
        siret: "919 014 163 00018",
        adresse: "11-13 AVENUE DE LA DIVISION LECLERC",
        complement: "",
        code_postal: "93000",
        commune: "BOBIGNY",
    };

    // Other code...

    return (
        <div>
            {/* Other JSX code... */}
            {/* Displaying information */}
            <h1>Dénomination: {defaultValues.denomination}</h1>
            <h2>N° SIRET: {defaultValues.siret}</h2>
            <h3>Code UAI: {defaultValues.uai}</h3>
            <h4>Adresse: {defaultValues.adresse}, {defaultValues.code_postal} {defaultValues.commune}</h4>
        </div>
    );
};

export default EntrepriseForm;