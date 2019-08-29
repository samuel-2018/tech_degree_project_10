import React from "react";
export const validationErrors = validationErrors => {
  return (
    <>
      {/* Are there validation errors? */}
      {!validationErrors ? (
        ""
      ) : (
        <div>
          <h2 className="validation--errors--label">Validation errors</h2>
          <div className="validation-errors">
            <ul>
              {/* Displays validation errors */}
              {validationErrors.map((error, index) => {
                // Is the error a "notEmpty" violation?
                if (error.validatorName === "notEmpty") {
                  return (
                    <li key={index}>
                      Please provide a value for "
                      {/* 'path' contains the database field name */}
                      <span className="capitalize">
                        {error.path.split(/(?=[A-Z])/).join(" ")}
                      </span>
                      ."
                    </li>
                  );
                } else if (error.validatorName === "isEmail") {
                  return (
                    <li key={index}>Please provide a valid email address.</li>
                  );
                }
                return (
                  <li key={index}>Something went wrong. Please try again.</li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
