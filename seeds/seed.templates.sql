INSERT INTO templates (name, template)
VALUES
('Personal Finance Statement', '{
  "a1": {
    "sectionTitle": "Assets",
    "components": {
      "a2": {
        "type": "table",
        "name": "Cash",
        "description": "Record the individual’s checkbook or passbook balance in all bank accounts as of the financial statement date. If possible, obtain copies of bank reconciliations.",
        "value": [
          [
            { "value": "Bank Name" },
            { "value": "Account Title" },
            { "value": "Statement Date" },
            { "value": "Restricted Yes/No" },
            { "value": "Reconciled Balance" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "Total:" },
            { "value": 0 }
          ]
        ],
        "componentTotal": {
          "sectionKey": "a1",
          "componentKey": "a2",
          "cell": { "row": 2, "col": 4 },
          "value": 0
        }
      },
      "ab2": {
        "type": "table",
        "name": "Marketable Securities",
        "description": "Obtain or prepare a listing of marketable securities with the following information (or attach a separate listing if necessary).",
        "value": [
          [
            { "value": "Name of Issuer" },
            { "value": "No. of Shares" },
            { "value": "Date Acquired" },
            { "value": "Pledged Yes/No" },
            { "value": "Tax Basis (cost) per Share" },
            { "value": "Market per Share" },
            { "value": "Total Cost (tax basis)" },
            { "value": "Total Market" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "Total:" },
            { "value": 0 }
          ]
        ],
        "componentTotal": {
          "sectionKey": "a1",
          "componentKey": "ab2",
          "cell": { "row": 2, "col": 7 },
          "value": 0
        }
      },
      "ac3": {
        "type": "fieldset",
        "name": "Broker cash balance",
        "fields": {
          "ad34": {
            "label": "Determine if the individual has a cash balance with a broker. If so, add this amount to cash or present as a separate item after cash.",
            "value": 0
          }
        },
        "componentTotal": {
          "sectionKey": "a1",
          "componentKey": "ac3",
          "fieldKey": "ad34",
          "value": 0
        }
      },
      "ad4": {
        "type": "table",
        "name": "Accounts and notes receivable",
        "description": "Inquire if individual has any personal accounts or notes receivable. Obtain the following facts:",
        "value": [
          [
            { "value": "Debtor\'s Name" },
            { "value": "Due Date" },
            { "value": "Interest Rate" },
            { "value": "Tax Basis (if different from principal to collect)" },
            { "value": "Cost Basis (principal to collect)" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "Total:" },
            { "value": 0 }
          ]
        ],
        "componentTotal": {
          "sectionKey": "a1",
          "componentKey": "ad4",
          "cell": { "row": 2, "col": 4 },
          "value": 0
        }
      },
      "adf5": {
        "type": "table",
        "name": "Investments in Closely Held Business",
        "description": "Each investment in a separate entity should be included as one amount in the statement of financial condition. When these investments are material, information regarding the various assets and liabilities and operating results should be set forth in a note to the financial statements. Obtain the following information:",
        "value": [
          [{ "value": "Name of Entity" }, { "value": "" }],
          [{ "value": "Type of Entity" }, { "value": "" }],
          [{ "value": "Statement Date" }, { "value": "" }],
          [{ "value": "Period Covered" }, { "value": "" }],
          [{ "value": "Basis of Accounting" }, { "value": "" }],
          [{ "value": "Significant Loss Contingencies" }, { "value": "" }],
          [{ "value": "Audited, Reviewed, or Compiled?" }, { "value": "" }],
          [{ "value": "Report Modified or Qualified?" }, { "value": "" }],
          [{ "value": "" }, { "value": "" }],
          [{ "value": "Total Current Assets" }, { "value": "" }],
          [{ "value": "Net Property, Plant, Equipment" }, { "value": "" }],
          [{ "value": "Other Assets" }, { "value": "" }],
          [{ "value": "Total Assets" }, { "value": 0 }]
        ],
        "componentTotal": {
          "sectionKey": "a1",
          "componentKey": "adf5",
          "cell": { "row": 12, "col": 1 },
          "value": 0
        }
      }
    }
  },
  "b1": {
    "sectionTitle": "Liabilities & Net Worth",
    "components": {
      "ba2": {
        "type": "table",
        "name": "Notes Payable",
        "description": "Obtain the following information for notes payable other than residential mortgage and other real estate loans.",
        "value": [
          [
            { "value": "Payable to" },
            { "value": "Collateral" },
            { "value": "Maturity Date" },
            { "value": "Monthly Payment" },
            { "value": "Stated Interest Rate" },
            { "value": "Implicit Interest Rate (if different)" },
            { "value": "Present Balance" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" }
          ],
          [
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "" },
            { "value": "Total:" },
            { "value": 0 }
          ]
        ],
        "componentTotal": {
          "sectionKey": "b1",
          "componentKey": "ba2",
          "cell": { "row": 2, "col": 6 },
          "value": 0
        }
      },
      "bac3": {
        "type": "fieldset",
        "name": "Net Worth",
        "fields": {
          "afd34": {
            "label": "Net Increase (Decrease) in Net Worth",
            "value": 0
          }
        },
        "componentTotal": {
          "sectionKey": "b1",
          "componentKey": "bac3",
          "fieldKey": "afd34",
          "value": 0
        }
      }
    }
  }
}');