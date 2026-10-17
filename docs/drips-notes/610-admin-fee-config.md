# Note to maintainers: admin fee configuration (#610)

The nine `app/lib/admin_fee_configuration_*.ts` helpers have no UI and are removed in #702, because the contract-side fee issues are still unresolved. No fee panel is built here. Once the contract fee work lands, a fee panel can be added on the admin page against the final contract interface.
