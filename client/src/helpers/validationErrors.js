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
              {validationErrors.map(error => {
                // Is the error a "notEmpty" violation?
                if (error.validatorName === "notEmpty") {
                  return (
                    <li>
                      Please provide a value for "
                      {/* 'path' contains the database field name */}
                      <span className="capitalize">{error.path}</span>."
                    </li>
                  );
                }
                return "Something went wrong. Please try again.";
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
