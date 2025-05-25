module quadfund::quadfund_donation {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::table::{Self, Table};

    // Error codes
    const E_ZERO_DONATION: u64 = 1;

    /// Struct to store project info
    struct Project has key, store {
        id: UID,
        owner: address,
        raised: Balance<SUI>,
        donors: Table<address, u64>
    }

    /// Create a new project owned by the caller
    public entry fun create_project(ctx: &mut TxContext) {
        let project = Project {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            raised: balance::zero<SUI>(),
            donors: table::new<address, u64>(ctx)
        };
        
        transfer::share_object(project);
    }

    /// Donate SUI to a project
    public entry fun donate(
        project: &mut Project,
        payment: &mut Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let donor = tx_context::sender(ctx);
        
        // Prevent zero donation
        assert!(amount > 0, E_ZERO_DONATION);
        assert!(coin::value(payment) >= amount, 2);

        // Take the specified amount from the payment coin
        let donation = coin::split(payment, amount, ctx);
        
        // Lock funds into raised balance
        let donation_balance = coin::into_balance(donation);
        balance::join(&mut project.raised, donation_balance);

        // Update donor record
        if (table::contains(&project.donors, donor)) {
            let prev_amount = *table::borrow(&project.donors, donor);
            table::remove(&mut project.donors, donor);
            table::add(&mut project.donors, donor, prev_amount + amount);
        } else {
            table::add(&mut project.donors, donor, amount);
        }
    }

    /// View total SUI raised
    public fun get_raised(project: &Project): u64 {
        balance::value(&project.raised)
    }

    /// View donation by a specific address
    public fun get_donation_by(project: &Project, donor: address): u64 {
        if (table::contains(&project.donors, donor)) {
            *table::borrow(&project.donors, donor)
        } else {
            0
        }
    }
} 