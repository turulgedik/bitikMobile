export const TrDateTime=(newDate = new Date())=>{
    var monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    var dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");
    
    Date.prototype.gun=()=>{
        return dayNames[newDate.getDay()]
    }
    Date.prototype.ay=()=>{
        return monthNames[newDate.getMonth()]
    }
    Date.prototype.getWeek=()=>{
        newDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
        newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(newDate.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (newDate - yearStart) / 86400000) + 1)/7);
        return weekNo;
    }
    Date.prototype.add=(i)=>{
        newDate.setDate(newDate.getDate()+i) 
    }

    return newDate
}