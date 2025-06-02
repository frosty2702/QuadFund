module quadfund::quadfund_fix {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use quadfund::quadfund_donation;

    /// This is a wrapper function that properly handles the coin
    public entry fun donate_and_handle_coin(
        project: &mut quadfund_donation::Project,
        payment: Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // Split the coin into donation amount and remainder
        let donation = coin::split(&mut payment, amount, ctx);
        
        // Call the donate function with the donation
        quadfund_donation::donate(project, &mut donation, amount, ctx);
        
        // Destroy the zero-balance coin
        if (coin::value(&donation) == 0) {
            coin::destroy_zero(donation);
        } else {
            // Return any remainder to sender
            let sender = tx_context::sender(ctx);
            transfer::public_transfer(donation, sender);
        };

        // Return the remaining payment to sender
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(payment, sender);
    }
} 