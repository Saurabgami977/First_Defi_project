import React, { Component } from 'react'
import dai from '../dai.png'

class Main extends Component {


    render() {
        return (
            <div>
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                            <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4">
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(e) => {
                            e.preventDefault();
                            let amount;
                            amount = this.input.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.stakeTokens(amount);
                        }}>
                            <div>
                                <label className="float-left"><b>Stake Tokens</b></label>
                                <span className="float-right text-muted">
                                    Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                                </span>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    ref={(input) => { this.input = input }}
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <img src={dai} height='32' alt="" />
                                        &nbsp;&nbsp;&nbsp; mDai
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-block btn-lg" type='submit'>
                                Stake!
                            </button>
                        </form>
                        <button
                            className="btn btn-link btn-block btn-sm"
                            type="submit"
                            onClick={e => {
                                e.preventDefault();
                                this.props.unstakeTokens()
                            }}
                        >
                            Un-STAKE...
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

export default Main;
