module bwflowers {

     export function hashFromString(s:string): number {
        var hash = 0;
        var i;
        if (s.length == 0) return hash;
        for (i = 0; i < s.length; i++) {
            var ch = s.charCodeAt(i);
            hash = ((hash<<5)-hash)+ch;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

}